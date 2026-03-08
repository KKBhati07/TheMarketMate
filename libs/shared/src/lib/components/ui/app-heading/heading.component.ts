import { Component, Input } from '@angular/core';
import { SHARED_UI_DEPS } from '@marketmate/shared';

@Component({
	selector: 'mm-heading',
	templateUrl: 'heading.component.html',
	styleUrls: ['heading.component.scss'],
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class HeadingComponent {
	@Input() text = ''
	@Input() public class = ''
	@Input() textClass = ''

}