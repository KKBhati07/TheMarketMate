import { NgModule } from '@angular/core';
import { ListingCardComponent } from './components/listing-card/app-listing-card.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, CurrencyPipe, NgIf, UpperCasePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { FormatTextPipe } from '../../pipes/format-text.pipe';
import { SharedModule } from '../shared/mm-shared.module';
import { ListingCardSkeletonComponent } from './components/listing-card-skeleton/listing-card-skeleton.component';

@NgModule({
	declarations: [ListingCardComponent, ListingCardSkeletonComponent],
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
		ListingCardComponent,
		ListingCardSkeletonComponent
	]
})
export class AppListingCardModule {
}