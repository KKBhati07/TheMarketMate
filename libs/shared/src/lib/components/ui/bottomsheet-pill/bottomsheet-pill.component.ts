import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';

@Component({
	selector: 'mm-bottomsheet-pill',
	templateUrl: './bottomsheet-pill.component.html',
	styleUrls: ['./bottomsheet-pill.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class BottomSheetPillComponent {

}
