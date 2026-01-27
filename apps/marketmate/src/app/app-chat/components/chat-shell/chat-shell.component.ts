import { Component } from '@angular/core';

@Component({
	selector: 'app-chat-shell',
	templateUrl: './chat-shell.component.html',
	styleUrls: ['./chat-shell.component.scss'],

})
export class ChatShellComponent {
	activeConversation: string | null = null;

	onSelectConversation(id: string) {
		this.activeConversation = id;
	}
}
