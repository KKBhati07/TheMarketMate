export interface Message {
	id: string;
	conversationId: string;
	senderUuid: string;
	content: string;
	createdAt: string;
	status?: 'sent' | 'delivered' | 'read';
}
