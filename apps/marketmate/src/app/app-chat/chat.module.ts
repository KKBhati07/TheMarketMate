import { NgModule } from '@angular/core';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatShellComponent } from './components/chat-shell/chat-shell.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { MessageBubbleComponent } from './components/message-bubble/message-bubble.component';
import { FormsModule } from '@angular/forms';
import { routes } from './chat.routes';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		RouterModule.forChild(routes),
	],
	declarations: [
		ChatInputComponent,
		ChatShellComponent,
		ChatWindowComponent,
		ConversationListComponent,
		MessageBubbleComponent,
	],
	exports: []
})
export class ChatModule {
}
