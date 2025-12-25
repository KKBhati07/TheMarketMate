import { NgModule } from "@angular/core";
// import { AppButtonComponent } from "../../../../../mm-shared/src/lib/components/app-button/app-button.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
// import { BottomSheetPillComponent } from "../../../../../mm-shared/src/lib/components/bottomsheet-pill/bottomsheet-pill.component";
import { ProductCategoryComponent } from "./component/product-category/product-category.component";
// import { AppNavButtonComponent } from "../../../../../mm-shared/src/lib/components/app-nav-button/app-nav-button.component";
// import { BackForwardIconComponent } from '../../../../../mm-shared/src/lib/components/back-forward-icon/back-forward-icon.component';
// import { CloseBtnComponent } from '../../../../../mm-shared/src/lib/components/close-btn/close-btn.component';
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

@NgModule({
	declarations: [
		// AppButtonComponent,
		// BottomSheetPillComponent,
		// AppNavButtonComponent,
		ProductCategoryComponent,
		// BackForwardIconComponent,
		// CloseBtnComponent,
		PriceSliderComponent,
		LocationSelectorComponent,
		HeadingComponent,
		AutocompleteSelectComponent,
		SellItemButtonComponent,
		PublishEditListingFormComponent,
		ImageUploadIconComponent
	],
	exports: [
		// AppButtonComponent,
		// BottomSheetPillComponent,
		ProductCategoryComponent,
		// AppNavButtonComponent,
		// BackForwardIconComponent,
		// CloseBtnComponent,
		PriceSliderComponent,
		LocationSelectorComponent,
		HeadingComponent,
		AutocompleteSelectComponent,
		SellItemButtonComponent,
		PublishEditListingFormComponent,
		ImageUploadIconComponent
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
