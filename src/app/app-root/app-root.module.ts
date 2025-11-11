import { NgModule } from "@angular/core";
import { AppRootComponent } from "./components/app-root.component";
import { HomeComponent } from "./components/home-component/home.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { AppListingCardModule } from '../app-listing-card/app-listing-card.module';
import { AppUtilModule } from '../app-util/module/app-util.module';
import { FiltersComponent } from './components/filters-component/filters.component';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';

@NgModule({
	declarations: [
		AppRootComponent,
		HomeComponent,
		FiltersComponent
	],
	imports: [CommonModule, MatIconModule, AppListingCardModule, AppUtilModule, MatSlider, MatSliderRangeThumb]
})
export class AppRootModule {
}
