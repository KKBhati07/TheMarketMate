import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-chat-input',
	templateUrl: './chat-input.component.html',
	styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent {
	@Output() send = new EventEmitter<string>();
	text = '';

	submit() {
		if (!this.text.trim()) return;
		this.send.emit(this.text);
		this.text = '';
	}
}
