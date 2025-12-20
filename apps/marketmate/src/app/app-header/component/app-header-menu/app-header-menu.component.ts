import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NavOption } from 'mm-shared';
import { fadeInOut } from 'mm-shared';
import { AppUrls } from '../../../app.urls';

@Component({
	selector: 'mm-header-menu',
	templateUrl: './app-header-menu.component.html',
	styleUrls: ['./app-header-menu.component.scss'],
	animations: [fadeInOut],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderMenuComponent {
	@Input() isAuthenticated: boolean = false;
	@Input() isAdmin: boolean = false;

	protected readonly AppUrls = AppUrls;

	@Output() onItemClick: EventEmitter<NavOption | null>
			= new EventEmitter<NavOption | null>();

	@Output() closeMenu: EventEmitter<void>
			= new EventEmitter<void>();

	constructor() {
	}
}