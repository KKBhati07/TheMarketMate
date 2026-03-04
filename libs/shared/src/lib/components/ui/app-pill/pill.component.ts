import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';

@Component({
	selector: 'mm-pill',
	templateUrl: './pill.component.html',
	styleUrls: ['./pill.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class PillComponent {
	@Input() text: string = '';
	@Input() clickable: boolean = false;
	@Input() class: string = '';
	@Input() textClass: string = '';
	@Input() backgroundColor: string = '#f5f5f5';
	@Input() textColor: string = '#757575';
	@Input() selected: boolean = false;
	@Input() activeColor: string = '#000000';
}