import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-conversation-list',
	templateUrl: './conversation-list.component.html'
})
export class ConversationListComponent {
	@Output() selectConversation = new EventEmitter<string>();

	conversations: any[] = [];

	select(id: string) {
		this.selectConversation.emit(id);
	}
}
