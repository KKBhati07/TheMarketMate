import { Component } from '@angular/core';
import { SHARED_UI_DEPS } from '@marketmate/shared';

@Component({
	selector: 'mm-user-list-skeleton',
	standalone: true,
	templateUrl: './user-list-skeleton.component.html',
	styleUrls: ['./user-list-skeleton.component.scss'],
	imports: [...SHARED_UI_DEPS]
})
export class UserListSkeletonComponent {
}
