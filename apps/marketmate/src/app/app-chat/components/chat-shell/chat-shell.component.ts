import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { ChatSocketService } from '../../../services/chat-socket.service';
import { ChatStateService } from '../../../services/chat-state.service';
import { Conversation } from '../../../models/coversation.model';

@Component({
	selector: 'app-chat-shell',
	templateUrl: './chat-shell.component.html',
	styleUrls: ['./chat-shell.component.scss'],
	standalone: true,
	imports: [CommonModule, ConversationListComponent, ChatWindowComponent]
})
export class ChatShellComponent implements OnInit, OnDestroy {
	activeConversation: string | null = null;
	conversations: (Conversation & { name?: string; avatar?: string; isOnline?: boolean })[] = [];
	private readonly subscriptions = new Subscription();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private chatSocket: ChatSocketService,
		private chatState: ChatStateService,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	ngOnInit() {
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		const userId = this.route.snapshot.queryParams['userId'];
		if (userId) {
			this.startConversationWithUser(userId);
		} else {
			const conversationId = this.route.snapshot.paramMap.get('conversationId');
			if (conversationId) {
				void this.onSelectConversation(conversationId);
			}
		}

		const conversationsSub = this.chatState.conversationList.subscribe((conversations) => {
			this.conversations = conversations;
		});
		this.subscriptions.add(conversationsSub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	async startConversationWithUser(otherUserUuid: string) {
		// Only run in browser
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		try {
			// Join conversation - connect() is called inside joinConversation
			const response = await this.chatSocket.joinConversation(otherUserUuid);
			if (response?.conversationId) {
				this.activeConversation = response.conversationId;
				this.chatState.setActiveConversation(response.conversationId);
				// Remove query parameter from URL after successful connection
				// this.router.navigate([], {
				// 	relativeTo: this.route,
				// 	queryParams: { userId: null },
				// 	queryParamsHandling: 'merge',
				// 	replaceUrl: true
				// });
			}
		} catch (error) {
			console.error('Error starting conversation:', error);
			// Optionally show user-friendly error message
		}
	}

	async onSelectConversation(id: string) {
		this.chatState.setActiveConversation(id);
		this.chatState.markConversationRead(id);

		const selectedConversation = this.conversations.find((c) => c.id === id);
		if (selectedConversation?.lastMessage) {
			this.chatState.addMessage(selectedConversation.lastMessage);
		}

		this.activeConversation = id;

		if (isPlatformBrowser(this.platformId)) {
			try {
				await this.chatSocket.joinConversationById(id);
				console.log(`Joined conversation room: ${id}`);
			} catch (error) {
				console.error('Error joining conversation room:', error);
			}
		}
	}

	onBack() {
		this.activeConversation = null;
		this.chatState.setActiveConversation(null);
	}
}
