import { Component, Input } from '@angular/core';

@Component({
	selector: 'mm-sell-item-button',
	templateUrl: './app-sell-item-btn.component.html',
	styleUrls: ['./app-sell-item-btn.component.scss']
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