import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-chat-input',
	templateUrl: './chat-input.component.html',
	styleUrls: ['./chat-input.component.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule]
})
export class ChatInputComponent {
	@Output() send = new EventEmitter<string>();
	text = '';

	@ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

	onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			this.submit();
		}
	}

	onInput() {
		if (this.messageInput?.nativeElement) {
			const textarea = this.messageInput.nativeElement;
			textarea.style.height = 'auto';
			const newHeight = Math.min(textarea.scrollHeight, 100);
			textarea.style.height = `${ newHeight }px`;
		}
	}

	submit() {
		if (!this.text.trim()) return;
		this.send.emit(this.text.trim());
		this.text = '';

		if (this.messageInput?.nativeElement) {
			this.messageInput.nativeElement.style.height = 'auto';
		}
	}
}
