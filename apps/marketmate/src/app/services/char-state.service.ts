import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatStateService {
	private messages$ = new BehaviorSubject<Message[]>([]);
	private activeConversation$ = new BehaviorSubject<string | null>(null);

	messages = this.messages$.asObservable();
	activeConversation = this.activeConversation$.asObservable();

	setConversation(id: string) {
		this.activeConversation$.next(id);
		this.messages$.next([]);
	}

	addMessage(msg: Message) {
		this.messages$.next([...this.messages$.value, msg]);
	}
}
