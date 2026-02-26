import { Injectable, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatSocketService } from './chat-socket.service';
import { ChatStateService } from './chat-state.service';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatRealtimeBridgeService {
	private started = false;
	private subs = new Subscription();

	constructor(
			private readonly chatSocket: ChatSocketService,
			private readonly chatState: ChatStateService,
			private readonly ngZone: NgZone,
	) {
	}

	start() {
		if (this.started) return;
		if (this.subs.closed) {
			this.subs = new Subscription();
		}
		this.started = true;
		this.subs.add(
				this.chatSocket.onMessage().subscribe((msg: Message) => {
					this.ngZone.run(() => {
						this.chatState.addMessage(msg);
					});
				})
		);

		this.subs.add(
				this.chatSocket.onConversationUpdated().subscribe((update) => {
					const lastMessage: Message = {
						id: update.lastMessage.id,
						conversationId: update.conversationId,
						senderUuid: update.lastMessage.senderUuid,
						content: update.lastMessage.content,
						createdAt: String(update.lastMessage.createdAt),
					};

					// Keep conversation list and message timeline in sync.
					// addMessage is dedupe-safe and also updates conversation metadata.
					this.ngZone.run(() => {
						this.chatState.addMessage(lastMessage);
					});
				})
		);

		this.subs.add(
				this.chatSocket.onTyping().subscribe((data: any) => {
					if (!data?.conversationId) return;
					this.ngZone.run(() => {
						this.chatState.setTyping(data.conversationId, Boolean(data.isTyping));
					});
				})
		);
	}

	stop() {
		this.subs.unsubscribe();
		this.started = false;
	}
}

