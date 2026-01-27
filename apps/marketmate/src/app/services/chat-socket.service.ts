import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';
import { fromEvent, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
	private socket!: Socket;

	connect() {
		this.socket = io(environment.chatServerUrl, {
			withCredentials: true, // session cookie
			transports: ['websocket']
		});
	}

	disconnect() {
		this.socket?.disconnect();
	}

	joinConversation(otherUserUuid: string) {
		this.socket.emit('join_conversation', { otherUserUuid });
	}

	sendMessage(conversationId: string, content: string) {
		this.socket.emit('send_message', { conversationId, content });
	}

	onMessage(): Observable<Message> {
		return fromEvent(this.socket, 'new_message');
	}

	onTyping(): Observable<any> {
		return fromEvent(this.socket, 'typing');
	}
}
