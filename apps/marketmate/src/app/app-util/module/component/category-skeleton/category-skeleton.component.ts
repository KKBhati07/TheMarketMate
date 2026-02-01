import { Component, Input } from '@angular/core';

@Component({
	selector: 'mm-category-skeleton',
	templateUrl: './category-skeleton.component.html',
	styleUrls: ['./category-skeleton.component.scss'],
})
export class CategorySkeletonComponent {

	@Input() isMobile: boolean = false;
}
