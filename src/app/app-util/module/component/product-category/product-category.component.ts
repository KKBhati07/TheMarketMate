import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CONSTANTS } from "../../../../app.constants";
import { Category } from '../../../../models/category.model';

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
		this.setIcon(categoryName);
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

	setIcon(categoryName: string) {
		switch (categoryName) {
			case CONSTANTS.CATEGORY.CAR:
				this.iconName = CONSTANTS.CATEGORY_ICON.CAR;
				break;
			case CONSTANTS.CATEGORY.BIKE:
				this.iconName = CONSTANTS.CATEGORY_ICON.BIKE;
				break;
			case CONSTANTS.CATEGORY.MOBILE:
				this.iconName = CONSTANTS.CATEGORY_ICON.MOBILE;
				break;
			case CONSTANTS.CATEGORY.ELECTRONIC:
				this.iconName = CONSTANTS.CATEGORY_ICON.ELECTRONIC;
				break;
			case CONSTANTS.CATEGORY.FURNITURE:
				this.iconName = CONSTANTS.CATEGORY_ICON.FURNITURE;
				break;
			case CONSTANTS.CATEGORY.PROPERTY:
				this.iconName = CONSTANTS.CATEGORY_ICON.PROPERTY;
				break;
			case CONSTANTS.CATEGORY.OTHER:
				this.iconName = CONSTANTS.CATEGORY_ICON.OTHER;
				break;
			default:
				this.iconName = CONSTANTS.CATEGORY_ICON.OTHER;
				break;
		}
	}
}
