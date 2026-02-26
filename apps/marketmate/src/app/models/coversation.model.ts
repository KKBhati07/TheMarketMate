import { Message } from './message.model';

export interface Conversation {
	id: string;
	participants: string[];
	lastMessage?: Message;
	unreadCount: number;
}
