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

@NgModule({
	declarations: [
		AppButtonComponent,
		BottomSheetPillComponent,
		AppNavButtonComponent,
		ProductCategoryComponent,
		BackForwardIconComponent,
		CloseBtnComponent,
		PriceSliderComponent
	],
	exports: [
		AppButtonComponent,
		BottomSheetPillComponent,
		ProductCategoryComponent,
		AppNavButtonComponent,
		BackForwardIconComponent,
		CloseBtnComponent,
		PriceSliderComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatSlider,
		MatSliderRangeThumb
	]
})
export class AppUtilModule {
}
