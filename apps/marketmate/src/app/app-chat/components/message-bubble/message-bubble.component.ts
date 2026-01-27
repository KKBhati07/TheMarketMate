import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.model';

@Component({
	selector: 'app-message-bubble',
	templateUrl: './message-bubble.component.html'
})
export class MessageBubbleComponent {
	@Input() message!: Message;
	isSelf = false; // compare with logged-in user
}
