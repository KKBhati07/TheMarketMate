import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NavOption } from 'mm-shared';
import { fadeInOut } from 'mm-shared';
import { AppUrls as SharedUrls } from 'mm-shared';
import { AppUrls } from '../../../utils/app.urls';

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
	@Input() userName: string = 'USER';

	protected readonly AppUrls = AppUrls;
	protected readonly SharedUrls = SharedUrls;

	@Output() onItemClick: EventEmitter<NavOption | null>
			= new EventEmitter<NavOption | null>();

	@Output() closeMenu: EventEmitter<void>
			= new EventEmitter<void>();

	constructor() {
	}
}