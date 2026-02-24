import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';
import { AppButtonComponent } from '../app-button/app-button.component';

@Component({
	selector: 'mm-empty-state',
	templateUrl: './empty-state.component.html',
	styleUrls: ['./empty-state.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, AppButtonComponent],
})
export class EmptyStateComponent {
	@Input() title = 'No listings found';
	@Input() subtitle = 'Try adjusting your filters or check back later.';
	@Input() icon: string = 'search_off';
	@Input() showSubtitle = false;
	@Input() actionText = '';
	@Input() actionDisabled = false;
	@Output() actionClicked = new EventEmitter<void>();

	onActionClick() {
		if (this.actionDisabled) return;
		this.actionClicked.emit();
	}
}
