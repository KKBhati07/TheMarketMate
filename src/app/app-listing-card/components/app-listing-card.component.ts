import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Listing } from '../../models/listing.model';
import { getIconName } from '../../app-util/common.util';
import { Router } from '@angular/router';
import { AppUrls } from '../../app.urls';
import { fadeSlideIn } from '../../app-util/animations/fade-slide-in.animation';

@Component({
	selector: 'mm-listing-card',
	templateUrl: 'app-listing-card.component.html',
	styleUrls: ['app-listing-card.component.scss'],
	animations: [fadeSlideIn],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingCardComponent implements OnInit {

	constructor(private cdr: ChangeDetectorRef,
							private router: Router,) {
	}

	@Input('listing') set setListing(listing: Listing) {
		this.listing = listing;
		this.iconName = getIconName(listing?.category.name);
		this.cdr.markForCheck();
	}

	listing: Listing | undefined;
	renderBrokenImage = false;
	iconName: string = '';

	ngOnInit() {
	}

	onCategoryIconClick() {
		this.router.navigate(
				[AppUrls.HOME],
				{
					queryParams: { category_id: this.listing?.category.id }
				}).then(r => null);
	}
}