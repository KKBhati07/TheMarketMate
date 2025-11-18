import { NgModule } from "@angular/core";
import { AppButtonComponent } from "./component/app-button/app-button.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { BottomSheetPillComponent } from "./component/bottomsheet-pill/bottomsheet-pill.component";
import { ProductCategoryComponent } from "./component/product-category/product-category.component";
import { AppNavButtonComponent } from "./component/app-nav-button/app-nav-button.component";
import { BackForwardIconComponent } from './component/back-forward-icon/back-forward-icon.component';
import { CloseBtnComponent } from './component/close-btn/close-btn.component';
import { PriceSliderComponent } from './component/price-slider/price-slider.component';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';
import { LocationSelectorComponent } from './component/location-selector/location-selector.component';
import { AutocompleteSelectComponent } from './component/app-autocomplete-select/app-autocomplete-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormatTextPipe } from '../pipes/format-text.pipe';
import { HeadingComponent } from './component/product-category/app-heading/heading.component';

@NgModule({
	declarations: [
		AppButtonComponent,
		BottomSheetPillComponent,
		AppNavButtonComponent,
		ProductCategoryComponent,
		BackForwardIconComponent,
		CloseBtnComponent,
		PriceSliderComponent,
		LocationSelectorComponent,
		HeadingComponent,
		AutocompleteSelectComponent
	],
	exports: [
		AppButtonComponent,
		BottomSheetPillComponent,
		ProductCategoryComponent,
		AppNavButtonComponent,
		BackForwardIconComponent,
		CloseBtnComponent,
		PriceSliderComponent,
		LocationSelectorComponent,
		HeadingComponent,
		AutocompleteSelectComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatSlider,
		MatSliderRangeThumb,
		ReactiveFormsModule,
		FormatTextPipe
	]
})
export class AppUtilModule {
}
