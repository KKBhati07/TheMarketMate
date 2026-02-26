import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Output,
	PLATFORM_ID,
	ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Message } from '../../../models/message.model';
import { ChatSocketService } from '../../../services/chat-socket.service';
import { ChatStateService } from '../../../services/chat-state.service';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { Subject, takeUntil } from 'rxjs';
import { DeviceDetectorService } from '@marketmate/shared';

@Component({
	selector: 'app-chat-window',
	templateUrl: './chat-window.component.html',
	styleUrls: ['./chat-window.component.scss'],
	standalone: true,
	imports: [CommonModule, MessageBubbleComponent, ChatInputComponent]
})
export class ChatWindowComponent implements OnInit, OnDestroy {
	private _conversationId = '';
	private initialized = false;

	@Input() set conversationId(value: string) {
		this._conversationId = value;
		if (!this.initialized) return;
		if (!isPlatformBrowser(this.platformId)) return;
		if (!value) return;
		this.bindConversation(value);
	}

	get conversationId(): string {
		return this._conversationId;
	}

	@Output() back = new EventEmitter<void>();

	messages: Message[] = [];
	contactName: string = 'Contact Name';
	contactAvatar: string | null = null;
	contactStatus: string = 'online';
	isTyping: boolean = false;
	isMobile = false;

	private destroy$ = new Subject<void>();
	private conversationDestroy$ = new Subject<void>();

	@ViewChild('scrollArea') scrollArea!: ElementRef<HTMLDivElement>;

	constructor(
			private chatSocket: ChatSocketService,
			private chatState: ChatStateService,
			private deviceDetector: DeviceDetectorService,
			private cdr: ChangeDetectorRef,
			@Inject(PLATFORM_ID) private platformId: Object
	) {
	}

	ngOnInit() {
		this.initialized = true;
		this.setIsMobile();
		if (isPlatformBrowser(this.platformId) && this.conversationId) {
			this.bindConversation(this.conversationId);
		}
	}

	ngOnDestroy() {
		this.conversationDestroy$.next();
		this.conversationDestroy$.complete();
		this.destroy$.next();
		this.destroy$.complete();
	}

	private bindConversation(conversationId: string) {
		this.conversationDestroy$.next();

		this.chatState.setActiveConversation(conversationId);
		this.chatState.messagesForConversation(conversationId)
				.pipe(takeUntil(this.conversationDestroy$), takeUntil(this.destroy$))
				.subscribe(msgs => {
					this.messages = msgs;
					this.cdr.markForCheck();
					this.scrollToBottom();
				});

		this.chatState.typingForConversation(conversationId)
				.pipe(takeUntil(this.conversationDestroy$), takeUntil(this.destroy$))
				.subscribe(isTyping => {
					this.isTyping = isTyping;
					this.cdr.markForCheck();
				});
	}

	sendMessage(text: string) {
		if (!text.trim() || !this.conversationId) return;

		const newMessage: Message = {
			id: `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
			conversationId: this.conversationId,
			senderUuid: 'current-user-uuid', // TODO: Get from auth service
			content: text.trim(),
			createdAt: new Date().toISOString(),
			status: 'sent'
		};

		console.log('[SEND MESSAGE] Sending message:', {
			messageId: newMessage.id,
			conversationId: this.conversationId,
			content: text.trim(),
			contentLength: text.trim().length,
			timestamp: newMessage.createdAt,
			status: 'sending'
		});

		this.chatState.addMessage(newMessage);
		this.chatSocket.sendMessage(this.conversationId, text.trim());
	}

	isMessageFromSelf(message: Message): boolean {
		// TODO: Compare with actual logged-in user UUID
		return message.senderUuid === 'current-user-uuid';
	}

	scrollToBottom() {
		setTimeout(() => {
			if (this.scrollArea?.nativeElement) {
				this.scrollArea.nativeElement.scrollTop =
						this.scrollArea.nativeElement.scrollHeight;
			}
		}, 0);
	}

	private setIsMobile() {
		this.deviceDetector.isMobile().pipe(takeUntil(this.destroy$)).subscribe(isMobile => {
			this.isMobile = isMobile;
		});
	}
}
