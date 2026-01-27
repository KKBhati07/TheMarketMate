import { Routes } from '@angular/router';
import { ChatShellComponent } from './components/chat-shell/chat-shell.component';

export const routes: Routes = [
	{
		path: '',
		component: ChatShellComponent
	},
	{
		path: ':conversationId',
		component: ChatShellComponent
	}
];
