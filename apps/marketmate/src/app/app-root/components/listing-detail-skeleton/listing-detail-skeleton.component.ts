import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_UI_DEPS } from '@marketmate/shared';

@Component({
	selector: 'mm-listing-detail-skeleton',
	templateUrl: './listing-detail-skeleton.component.html',
	styleUrls: ['./listing-detail-skeleton.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS],
})
export class ListingDetailSkeletonComponent {
}
