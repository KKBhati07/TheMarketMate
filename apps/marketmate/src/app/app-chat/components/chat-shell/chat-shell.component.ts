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

		const conversationsSub = this.chatState.conversationList.subscribe((conversations) => {
			this.conversations = conversations;
		});
		this.subscriptions.add(conversationsSub);

		void this.initChat();
	}

	private async initChat() {
		await this.loadConversationList();

		const userId = this.route.snapshot.queryParams['userId'];
		if (userId) {
			await this.startConversationWithUser(userId);
			return;
		}

		const conversationId = this.route.snapshot.paramMap.get('conversationId');
		if (conversationId) {
			await this.onSelectConversation(conversationId);
		}
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
			const response = await this.chatSocket.joinConversation(otherUserUuid);
			if (response?.conversationId) {
				this.activeConversation = response.conversationId;
				this.chatState.setActiveConversation(response.conversationId);
				this.chatState.markConversationRead(response.conversationId);
				await this.loadMessageHistory(response.conversationId);
				await this.loadConversationList();
			}
		} catch (error) {
			console.error('Error starting conversation:', error);
		}
	}

	async onSelectConversation(id: string) {
		await this.openConversation(id);
	}

	private async openConversation(id: string) {
		this.chatState.setActiveConversation(id);
		this.chatState.markConversationRead(id);
		this.activeConversation = id;

		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		try {
			await this.chatSocket.joinConversationById(id);
			await this.loadMessageHistory(id);
		} catch (error) {
			console.error('Error opening conversation:', error);
		}
	}

	private async loadMessageHistory(conversationId: string) {
		try {
			const response = await this.chatSocket.getMessages(conversationId);
			if (response.success) {
				this.chatState.setMessages(conversationId, response.messages);
			} else {
				console.warn('Failed to load message history:', response.error);
			}
		} catch (error) {
			console.error('Error loading message history:', error);
		}
	}

	private async loadConversationList() {
		try {
			const response = await this.chatSocket.listConversations();
			if (response.success) {
				this.chatState.setConversations(response.conversations);
			} else {
				console.warn('Failed to load conversation list:', response.error);
			}
		} catch (error) {
			console.error('Error loading conversation list:', error);
		}
	}

	onBack() {
		this.activeConversation = null;
		this.chatState.setActiveConversation(null);
	}
}
