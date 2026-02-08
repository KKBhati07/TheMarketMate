import { Component, Input } from '@angular/core';
import { SHARED_UI_DEPS } from '@marketmate/shared';

@Component({
	selector: 'mm-category-skeleton',
	templateUrl: './category-skeleton.component.html',
	styleUrls: ['./category-skeleton.component.scss'],
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class CategorySkeletonComponent {

	@Input() isMobile: boolean = false;
}
