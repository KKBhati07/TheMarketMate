import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NavOption, SHARED_UI_DEPS, fadeInOut, AppNavButtonComponent } from '@marketmate/shared';
import { AppUrls } from '../../../app.urls';
import { AppUrls as SharedUrls} from '@marketmate/shared';
import { handleKeyboardActivation } from '@marketmate/shared';
import { SellItemButtonComponent } from '../../../app-util/module/component/app-sell-item-button/app-sell-item-btn.component';

@Component({
	selector: 'mm-header-menu',
	templateUrl: './app-header-menu.component.html',
	styleUrls: ['./app-header-menu.component.scss'],
	animations: [fadeInOut],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, AppNavButtonComponent, SellItemButtonComponent]
})
export class AppHeaderMenuComponent {
	@Input() isAuthenticated: boolean = false;
	@Input() isAdmin: boolean = false;

	protected readonly AppUrls = AppUrls;
	protected readonly SharedUrls = SharedUrls;

	@Output() onItemClick: EventEmitter<NavOption | null>
			= new EventEmitter<NavOption | null>();

	@Output() closeMenu: EventEmitter<void>
			= new EventEmitter<void>();

	constructor() {
	}

	onOuterKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onItemClick.emit(), event);
	}
}