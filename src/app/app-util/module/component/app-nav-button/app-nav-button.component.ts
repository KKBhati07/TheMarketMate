import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { IconPosition } from '../../../../models/button-options.model';
import { Params } from '@angular/router';
import { RouteTarget } from '../../../../models/common.model';


@Component({
	selector: 'mm-nav-button',
	templateUrl: './app-nav-button.component.html',
	styleUrls: ['./app-nav-button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavButtonComponent {
	@Input() isMobile = false;
	@Input() headerNav = false;
	@Input() iconPosition: IconPosition = 'LEFT';
	@Input() isLogoutBtn = false;
	@Input() indicateActiveBtn = false;
	@Input() class = '';
	@Input() text = '';
	@Input() gap = '';
	@Input() icon = '';
	@Input() showIcon = false;
	@Input() iconClass = '';
	@Input() iconContainerClass = '';
	@Input() active = false;
	@Input() textClass = '';
	@Input() onMobileWidth = '';

	@Input() routerLink?: any[] | string;
	@Input() queryParams?: Params | null;
	@Input() fragment?: string;
	@Input() target?: RouteTarget;
	@Input() exact: boolean = true;


}
