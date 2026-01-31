import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'mm-user-profile-bar',
	templateUrl: 'user-profile-bar.component.html',
	styleUrls: ['user-profile-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileBarComponent {

	@Input() userProfileUrl: string | null = null;
	@Input() userName: string | null = null;
	renderIcon = false;
	@Output() showProfileDetails:
			EventEmitter<boolean> =
			new EventEmitter<boolean>();
}