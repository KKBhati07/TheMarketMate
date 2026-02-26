import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Message } from '../models/message.model';
import { Conversation } from '../models/coversation.model';

@Injectable({ providedIn: 'root' })
export class ChatStateService {
	private readonly MAX_MESSAGES_PER_CONVERSATION = 200;
	private readonly MAX_CONVERSATIONS = 10000;
	private readonly DEDUPE_WINDOW_MS = 15000;
	private readonly EMPTY_MESSAGES: Message[] = [];
	private readonly messagesByConversation$ = new BehaviorSubject<Record<string, Message[]>>({});
	private readonly activeConversationId$ = new BehaviorSubject<string | null>(null);
	private readonly conversations$ = new BehaviorSubject<
		(Conversation & { name?: string; avatar?: string; isOnline?: boolean })[]
	>([]);
	private readonly typingByConversation$ = new BehaviorSubject<Record<string, boolean>>({});

	conversationList = this.conversations$.asObservable();

	setActiveConversation(id: string | null) {
		this.activeConversationId$.next(id);
	}

	messagesForConversation(conversationId: string): Observable<Message[]> {
		return this.messagesByConversation$.pipe(
			map((byConversation) => byConversation[conversationId] ?? this.EMPTY_MESSAGES),
			distinctUntilChanged()
		);
	}

	typingForConversation(conversationId: string): Observable<boolean> {
		return this.typingByConversation$.pipe(
			map((typingByConversation) => Boolean(typingByConversation[conversationId])),
			distinctUntilChanged()
		);
	}

	addMessage(msg: Message | Record<string, unknown>) {
		const m = this.normalizeMessage(msg);
		if (!m) return;

		const byConversation = this.messagesByConversation$.value;
		const current = byConversation[m.conversationId] ?? this.EMPTY_MESSAGES;

		if (current.some((x) => x.id === m.id)) return;
		const optimisticDuplicateIndex = this.findOptimisticDuplicateIndex(current, m);
		let nextMessages = optimisticDuplicateIndex >= 0
			? current.map((existing, i) => i === optimisticDuplicateIndex ? m : existing)
			: [...current, m];

		if (nextMessages.length > this.MAX_MESSAGES_PER_CONVERSATION) {
			nextMessages = nextMessages.slice(nextMessages.length - this.MAX_MESSAGES_PER_CONVERSATION);
		}

		this.messagesByConversation$.next({
			...byConversation,
			[m.conversationId]: nextMessages,
		});
		this.setTyping(m.conversationId, false);

		this.upsertConversationFromMessage(m);
	}

	setTyping(conversationId: string, isTyping: boolean) {
		const current = this.typingByConversation$.value;
		if (isTyping) {
			if (current[conversationId]) return;
			this.typingByConversation$.next({
				...current,
				[conversationId]: true,
			});
			return;
		}
		if (!current[conversationId]) return;
		const { [conversationId]: _, ...rest } = current;
		this.typingByConversation$.next({
			...rest,
		});
	}

	upsertConversationFromMessage(
		message: Message,
		overrides?: Partial<Conversation & { name?: string; avatar?: string; isOnline?: boolean }>
	) {
		const activeId = this.activeConversationId$.value;
		const conversations = this.conversations$.value;
		const existingIndex = conversations.findIndex((c) => c.id === message.conversationId);
		const existing = existingIndex >= 0 ? conversations[existingIndex] : undefined;

		const unreadIncrement = message.senderUuid !== 'current-user-uuid' && message.conversationId !== activeId ? 1 : 0;
		const nextUnreadCount = existing
			? (message.conversationId === activeId ? 0 : (existing.unreadCount ?? 0) + unreadIncrement)
			: unreadIncrement;

		const base: Conversation & { name?: string; avatar?: string; isOnline?: boolean } = existing ?? {
			id: message.conversationId,
			participants: [],
			unreadCount: 0,
			name: overrides?.name ?? 'Unknown',
			avatar: overrides?.avatar,
			isOnline: overrides?.isOnline ?? false,
		};

		const updated: Conversation & { name?: string; avatar?: string; isOnline?: boolean } = {
			...base,
			...overrides,
			id: message.conversationId,
			lastMessage: message,
			unreadCount: nextUnreadCount,
		};

		let next: (Conversation & { name?: string; avatar?: string; isOnline?: boolean })[];
		if (existingIndex === 0) {
			next = [updated, ...conversations.slice(1)];
		} else if (existingIndex > 0) {
			next = [updated, ...conversations.slice(0, existingIndex), ...conversations.slice(existingIndex + 1)];
		} else {
			next = [updated, ...conversations];
		}
		if (next.length > this.MAX_CONVERSATIONS) {
			next = next.slice(0, this.MAX_CONVERSATIONS);
		}
		this.conversations$.next(next);
	}

	markConversationRead(conversationId: string) {
		const current = this.conversations$.value;
		const target = current.find(c => c.id === conversationId);
		if (!target || !target.unreadCount) return;

		const updated = this.conversations$.value.map((c) =>
			c.id === conversationId ? { ...c, unreadCount: 0 } : c
		);
		this.conversations$.next(updated);
	}

	private normalizeMessage(msg: Message | Record<string, unknown>): Message | null {
		const raw = msg as Record<string, unknown>;
		const id = (raw['id'] ?? raw['messageId']) as string | undefined;
		const conversationId = raw['conversationId'] as string | undefined;
		const senderUuid = raw['senderUuid'] as string | undefined;
		const content = raw['content'] as string | undefined;
		if (!id || !conversationId || !senderUuid || content === undefined) return null;
		const createdAt = raw['createdAt'] != null ? String(raw['createdAt']) : new Date().toISOString();
		return { id, conversationId, senderUuid, content, createdAt };
	}

	private findOptimisticDuplicateIndex(current: Message[], incoming: Message): number {
		const incomingTime = new Date(incoming.createdAt).getTime();
		if (Number.isNaN(incomingTime)) return -1;

		return current.findIndex(existing => {
			if (existing.id === incoming.id) return true;
			if (existing.conversationId !== incoming.conversationId) return false;
			if (existing.senderUuid !== incoming.senderUuid) return false;
			if (existing.content !== incoming.content) return false;
			if (!this.isOptimisticId(existing.id)) return false;
			const existingTime = new Date(existing.createdAt).getTime();
			if (Number.isNaN(existingTime)) return false;
			return Math.abs(incomingTime - existingTime) <= this.DEDUPE_WINDOW_MS;
		});
	}

	private isOptimisticId(id: string): boolean {
		return id.startsWith('tmp_') || /^\d+$/.test(id);
	}
}
