import { Component } from '@angular/core';
import { SHARED_UI_DEPS } from '../../../../constants/shared-imports';

@Component({
	selector: 'mm-listing-card-skeleton',
	templateUrl: './listing-card-skeleton.component.html',
	styleUrls: ['./listing-card-skeleton.component.scss'],
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class ListingCardSkeletonComponent {
}
