import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conversation } from '../../../models/coversation.model';
import { SHARED_UI_DEPS } from '@marketmate/shared';

@Component({
	selector: 'app-conversation-list',
	templateUrl: './conversation-list.component.html',
	styleUrls: ['./conversation-list.component.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, SHARED_UI_DEPS]
})
export class ConversationListComponent implements OnInit, OnChanges {
	@Input() conversations: (Conversation & { name?: string; avatar?: string; isOnline?: boolean })[] = [];
	@Input() selectedConversationId: string | null = null;
	@Output() selectConversation = new EventEmitter<string>();

	searchQuery: string = '';
	filteredConversations: (Conversation & { name?: string; avatar?: string; isOnline?: boolean })[] = [];

	ngOnInit() {
		this.filteredConversations = this.conversations;
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['conversations']) {
			this.onSearch();
		}
	}

	select(id: string) {
		this.selectConversation.emit(id);
	}

	onSearch() {
		if (!this.searchQuery.trim()) {
			this.filteredConversations = this.conversations;
			return;
		}

		const query = this.searchQuery.toLowerCase().trim();
		this.filteredConversations = this.conversations.filter(convo =>
			convo.name?.toLowerCase().includes(query) ||
			convo.lastMessage?.content.toLowerCase().includes(query)
		);
	}

	formatTime(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) {
			return 'now';
		} else if (diffMins < 60) {
			return `${diffMins}m`;
		} else if (diffHours < 24) {
			return `${diffHours}h`;
		} else if (diffDays < 7) {
			return `${diffDays}d`;
		} else {
			return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		}
	}
}
