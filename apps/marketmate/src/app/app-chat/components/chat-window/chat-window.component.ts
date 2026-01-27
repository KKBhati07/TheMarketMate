import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Message } from '../../../models/message.model';

@Component({
	selector: 'app-chat-window',
	templateUrl: './chat-window.component.html',
	styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements AfterViewInit {
	@Input() conversationId!: string;
	@Output() back = new EventEmitter<void>();

	messages: Message[] = [];

	@ViewChild('scrollArea') scrollArea!: ElementRef;

	ngAfterViewInit() {
		this.scrollToBottom();
	}

	sendMessage(text: string) {
		// socket emit here
	}

	scrollToBottom() {
		setTimeout(() => {
			this.scrollArea.nativeElement.scrollTop =
					this.scrollArea.nativeElement.scrollHeight;
		});
	}
}
