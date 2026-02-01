import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { ProductCategoryComponent } from "./component/product-category/product-category.component";
import { PriceSliderComponent } from './component/price-slider/price-slider.component';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';
import { LocationSelectorComponent } from './component/location-selector/location-selector.component';
import { AutocompleteSelectComponent } from './component/app-autocomplete-select/app-autocomplete-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormatTextPipe, SharedModule } from 'mm-shared';
import { HeadingComponent } from './component/product-category/app-heading/heading.component';
import { SellItemButtonComponent } from './component/app-sell-item-button/app-sell-item-btn.component';
import { RouterModule } from '@angular/router';
import { PublishEditListingFormComponent } from './component/publish-listing-form/publish-edit-listing-form.component';
import { ImageUploadIconComponent } from './component/image-upload-icon/image-upload-icon.component';
import { CategorySkeletonComponent } from './component/category-skeleton/category-skeleton.component';

@NgModule({
	declarations: [
		ProductCategoryComponent,
		CategorySkeletonComponent,
		PriceSliderComponent,
		LocationSelectorComponent,
		HeadingComponent,
		AutocompleteSelectComponent,
		SellItemButtonComponent,
		PublishEditListingFormComponent,
		ImageUploadIconComponent
	],
	exports: [
		ProductCategoryComponent,
		PriceSliderComponent,
		LocationSelectorComponent,
		HeadingComponent,
		AutocompleteSelectComponent,
		SellItemButtonComponent,
		PublishEditListingFormComponent,
		ImageUploadIconComponent,
		CategorySkeletonComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatSlider,
		MatSliderRangeThumb,
		ReactiveFormsModule,
		RouterModule,
		FormatTextPipe,
		SharedModule
	]
})
export class AppUtilModule {
}
