import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CONSTANTS } from "../../../../app.constants";
import { Category } from 'mm-shared';
import { getIconName } from 'mm-shared';

@Component({
	selector: 'mm-product-category',
	templateUrl: './product-category.component.html',
	styleUrls: ['./product-category.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryComponent implements OnInit {
	@Output() onCategoryClickEmitter = new EventEmitter<Category | null>();

	@Input('category') set setTitleAnIcon(category: Category) {
		this.category = category;
		const categoryName = category.name;
		this.isActive = category.active;
		this.iconName = getIconName(category.name);
		if (categoryName === CONSTANTS.CATEGORY.MOBILE) this.title = 'MOBILE'
		else this.title = categoryName.toUpperCase();
		this.loadComponent = true;
	}

	@Input() isMobile = false;
	isActive = false;
	category: Category | null = null;
	title = '';
	iconName = '';
	loadComponent = false;

	constructor() {
	}

	ngOnInit() {
	}
}
