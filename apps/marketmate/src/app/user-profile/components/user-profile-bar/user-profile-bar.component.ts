import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SHARED_UI_DEPS } from '@marketmate/shared';

@Component({
	selector: 'mm-user-profile-bar',
	templateUrl: 'user-profile-bar.component.html',
	styleUrls: ['user-profile-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class UserProfileBarComponent {

	@Input() userProfileUrl: string | null = null;
	@Input() userName: string | null = null;
	renderIcon = false;
	@Output() showProfileDetails:
			EventEmitter<boolean> =
			new EventEmitter<boolean>();
}