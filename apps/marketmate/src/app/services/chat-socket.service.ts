import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
	private socket!: Socket;
	private readonly isBrowser: boolean;
	private connectionPromise: Promise<void> | null = null;
	private coreListenersAttached = false;

	// Core event streams (hot) - receive events even if UI isn't mounted
	private readonly newMessageSubject = new Subject<Message>();
	private readonly conversationUpdatedSubject = new Subject<{
		conversationId: string;
		lastMessage: {
			id: string;
			content: string;
			senderUuid: string;
			createdAt: Date;
		};
		senderUuid: string;
	}>();
	private readonly typingSubject = new Subject<any>();

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	private ensureCoreListeners() {
		if (!this.socket || this.coreListenersAttached) return;
		this.coreListenersAttached = true;

		// Log + broadcast incoming events centrally so they are never "missed"
		this.socket.on('new_message', (msg: Message) => {
			console.log('[SOCKET EVENT] new_message received:', {
				socketId: this.socket?.id,
				messageId: (msg as any)?.id,
				conversationId: (msg as any)?.conversationId,
				senderUuid: (msg as any)?.senderUuid,
				timestamp: new Date().toISOString(),
				content: msg.content,
			});
			this.newMessageSubject.next(msg);
		});

		this.socket.on('conversation_updated', (data: any) => {
			console.log('[SOCKET EVENT] conversation_updated received:', {
				socketId: this.socket?.id,
				conversationId: data?.conversationId,
				senderUuid: data?.senderUuid,
				timestamp: new Date().toISOString(),
			});
			this.conversationUpdatedSubject.next(data);
		});

		this.socket.on('typing', (data: any) => {
			this.typingSubject.next(data);
		});
	}

	connect(): Promise<void> {
		// Only connect in browser, not during SSR
		if (!this.isBrowser) {
			return Promise.reject(new Error('Socket operations not available during SSR'));
		}

		// If already connected, return resolved promise
		if (this.socket && this.socket.connected) {
			return Promise.resolve();
		}

		// If connection is in progress, return the existing promise
		if (this.connectionPromise) {
			return this.connectionPromise;
		}

		// Create new connection
		this.connectionPromise = new Promise((resolve, reject) => {
			if (!this.socket || !this.socket.connected) {
				this.socket = io(environment.chatServerUrl, {
					withCredentials: true, // session cookie
					transports: ['websocket'],
					reconnection: true,
					reconnectionAttempts: 5,
					reconnectionDelay: 1000,
					timeout: 10000
				});
				this.coreListenersAttached = false;
				this.ensureCoreListeners();

				// Wait for connection
				this.socket.on('connect', () => {
					console.log('Socket connected');
					this.connectionPromise = null;
					resolve();
				});

				this.socket.on('connect_error', (error: Error) => {
					console.error('Socket connection error:', error);
					this.connectionPromise = null;
					reject(error);
				});

				this.socket.on('disconnect', (reason: string) => {
					console.log('Socket disconnected:', reason);
					this.connectionPromise = null;
				});
			} else {
				resolve();
			}
		});

		return this.connectionPromise;
	}

	disconnect() {
		if (this.isBrowser && this.socket) {
			this.socket.disconnect();
		}
	}

	async joinConversation(otherUserUuid: string): Promise<{ conversationId: string }> {
		if (!this.isBrowser) {
			return Promise.reject(new Error('Socket operations not available during SSR'));
		}

		if (!this.socket || !this.socket.connected) {
			await this.connect();
		}

		return new Promise((resolve, reject) => {
			if (!this.socket || !this.socket.connected) {
				reject(new Error('Socket not connected'));
				return;
			}

			const timeout = setTimeout(() => {
				reject(new Error('Join conversation timeout'));
			}, 10000);

			this.socket.emit('join_conversation', { otherUserUuid }, (response: { conversationId: string } | Error) => {
				clearTimeout(timeout);
				if (response instanceof Error) {
					reject(response);
				} else if (response && response.conversationId) {
					resolve(response);
				} else {
					reject(new Error('Invalid response from server'));
				}
			});
		});
	}

	/**
	 * Join an existing conversation by conversationId.
	 * Used when selecting an existing conversation from the list.
	 */
	async joinConversationById(conversationId: string): Promise<{ conversationId: string; success: boolean }> {
		if (!this.isBrowser) {
			return Promise.reject(new Error('Socket operations not available during SSR'));
		}

		// Reuse existing socket - do NOT reconnect
		if (!this.socket || !this.socket.connected) {
			await this.connect();
		}

		return new Promise((resolve, reject) => {
			if (!this.socket || !this.socket.connected) {
				reject(new Error('Socket not connected'));
				return;
			}

			// Set timeout for the response
			const timeout = setTimeout(() => {
				reject(new Error('Join conversation by ID timeout'));
			}, 10000);

			this.socket.emit('join_conversation_by_id', { conversationId }, (response: { conversationId: string; success: boolean } | Error) => {
				clearTimeout(timeout);
				if (response instanceof Error) {
					reject(response);
				} else if (response && response.conversationId) {
					resolve(response);
				} else {
					reject(new Error('Invalid response from server'));
				}
			});
		});
	}

	sendMessage(conversationId: string, content: string) {
		if (this.isBrowser && this.socket && this.socket.connected) {
			console.log('[SOCKET EMIT] Sending message via socket:', {
				event: 'send_message',
				conversationId,
				content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
				contentLength: content.length,
				socketConnected: this.socket.connected,
				socketId: this.socket.id,
				timestamp: new Date().toISOString()
			});
			this.socket.emit('send_message', { conversationId, content });
		} else {
			console.warn('[SOCKET EMIT] Cannot send message - socket not ready:', {
				isBrowser: this.isBrowser,
				socketExists: !!this.socket,
				socketConnected: this.socket?.connected ?? false
			});
		}
	}

	onMessage(): Observable<Message> {
		if (!this.isBrowser) return new Observable<Message>();

		// Ensure connected so core listeners are attached, then expose hot stream
		return new Observable<Message>((subscriber) => {
			let sub: { unsubscribe: () => void } | null = null;
			this.connect()
				.then(() => {
					this.ensureCoreListeners();
					sub = this.newMessageSubject.subscribe(subscriber);
				})
				.catch(err => subscriber.error(err));

			return () => sub?.unsubscribe();
		});
	}


	onTyping(): Observable<any> {
		if (!this.isBrowser) return new Observable<any>();

		return new Observable<any>((subscriber) => {
			let sub: { unsubscribe: () => void } | null = null;
			this.connect()
				.then(() => {
					this.ensureCoreListeners();
					sub = this.typingSubject.subscribe(subscriber);
				})
				.catch(err => subscriber.error(err));

			return () => sub?.unsubscribe();
		});
	}

	/**
	 * Listen for conversation updates (new messages, unread counters, etc.)
	 * Emitted to user's personal room when they receive a message in any conversation
	 */
	onConversationUpdated(): Observable<{
		conversationId: string;
		lastMessage: {
			id: string;
			content: string;
			senderUuid: string;
			createdAt: Date;
		};
		senderUuid: string;
	}> {
		if (!this.isBrowser) return new Observable();

		return new Observable((subscriber) => {
			let sub: { unsubscribe: () => void } | null = null;
			this.connect()
				.then(() => {
					this.ensureCoreListeners();
					sub = this.conversationUpdatedSubject.subscribe(subscriber);
				})
				.catch(err => subscriber.error(err));

			return () => sub?.unsubscribe();
		});
	}
}
