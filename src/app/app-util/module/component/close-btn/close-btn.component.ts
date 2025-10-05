import { Component, Input } from '@angular/core';

@Component({
	selector: 'mm-close-btn',
	templateUrl: './close-btn.component.html',
	styleUrls: ['./close-btn.component.scss']

})
export class CloseBtnComponent {
	@Input() backgroundColor = 'white'
	@Input() containerClass: string = '';
	@Input() iconClass: string = '';
	@Input() iconColor: string = 'var(--primary-color)';
}