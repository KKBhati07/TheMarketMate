import { Component, Input } from '@angular/core';
import { SHARED_UI_DEPS } from '@marketmate/shared';

@Component({
	selector: 'mm-sell-item-button',
	templateUrl: './app-sell-item-btn.component.html',
	styleUrls: ['./app-sell-item-btn.component.scss'],
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class SellItemButtonComponent {
	@Input() class = '';
	@Input() text = '';
	@Input() gap = '';
	@Input() icon = '';
	@Input() showIcon = false;
	@Input() iconClass = '';
	@Input() textClass = '';
	@Input() onMobileWidth = '';
}