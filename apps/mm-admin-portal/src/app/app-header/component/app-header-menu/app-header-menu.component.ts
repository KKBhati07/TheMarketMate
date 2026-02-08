import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NavOption, SHARED_UI_DEPS, AppNavButtonComponent } from '@marketmate/shared';
import { fadeInOut } from '@marketmate/shared';
import { AppUrls as SharedUrls } from '@marketmate/shared';
import { AppUrls } from '../../../utils/app.urls';

@Component({
	selector: 'mm-header-menu',
	standalone: true,
	templateUrl: './app-header-menu.component.html',
	styleUrls: ['./app-header-menu.component.scss'],
	animations: [fadeInOut],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [...SHARED_UI_DEPS, AppNavButtonComponent]
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
