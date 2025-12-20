import { Component, Input } from '@angular/core';

@Component({
	selector: 'mm-heading',
	templateUrl: 'heading.component.html',
	styleUrls: ['heading.component.scss']
})
export class HeadingComponent {
	@Input() text = ''
	@Input() public class = ''
	@Input() textClass = ''

}