import { NgModule } from '@angular/core';
import { ListingCardComponent } from './components/app-listing-card.component';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe, NgIf, UpperCasePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { FormatTextPipe } from '../app-util/pipes/format-text.pipe';

@NgModule({
	declarations: [ListingCardComponent],
	imports: [
		MatIcon,
		UpperCasePipe,
		NgIf,
		CurrencyPipe,
		MatTooltip,
		FormatTextPipe
	],
	exports: [
		ListingCardComponent
	]
})
export class AppListingCardModule {
}