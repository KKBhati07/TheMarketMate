import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../models/message.model';

@Component({
	selector: 'app-message-bubble',
	templateUrl: './message-bubble.component.html',
	styleUrls: ['./message-bubble.component.scss'],
	standalone: true,
	imports: [CommonModule]
})
export class MessageBubbleComponent {
	@Input() message!: Message;
	@Input() isSelf: boolean = false;

	formatTime(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const isToday = date.toDateString() === now.toDateString();

		if (isToday) {
			return `${ hours.toString().padStart(2, '0') }:${ minutes.toString().padStart(2, '0') }`;
		} else {
			return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
		}
	}
}
