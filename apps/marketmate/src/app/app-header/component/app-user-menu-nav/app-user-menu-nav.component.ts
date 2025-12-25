import { Component, Input } from '@angular/core';

@Component({
	selector: 'mm-user-menu-nav',
	templateUrl: './app-user-menu-nav.component.html',
	styleUrls: ['./app-user-menu-nav.component.scss'],
})
export class UserMenuNavComponent {
	@Input() class = '';
	@Input() text = '';
	@Input() gap = '';
	@Input() icon = '';
	@Input() showIcon = false;
	@Input() iconClass = '';
	@Input() textContainerClass = '';
	@Input() textClass = '';
	@Input() iconImgContainerClass = '';
	@Input() imageUrl = '';
	@Input() imageClass = '';
	renderFallbackIcon = false;


}