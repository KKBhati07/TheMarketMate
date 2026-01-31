import { NgModule } from '@angular/core';
import { ListingCardComponent } from './components/app-listing-card.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, CurrencyPipe, NgIf, UpperCasePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { FormatTextPipe } from '../../pipes/format-text.pipe';
import { SharedModule } from '../shared/mm-shared.module';

@NgModule({
	declarations: [ListingCardComponent],
	imports: [
		MatIcon,
		UpperCasePipe,
		NgIf,
		CurrencyPipe,
		MatTooltip,
		FormatTextPipe,
		CommonModule,
		SharedModule
	],
	exports: [
		ListingCardComponent
	]
})
export class AppListingCardModule {
}