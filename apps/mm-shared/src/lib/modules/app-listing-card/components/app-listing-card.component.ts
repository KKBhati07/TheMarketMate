import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output
} from '@angular/core';
import { Listing } from '../../../models/listing.model';
import { getIconName } from '../../../utils/common.util';
import { Router } from '@angular/router';
import { AppUrls } from '../../../common.urls';
import { fadeSlideIn } from '../../../animations/fade-slide-in.animation';
import { FavoriteService } from '../../../services/favorite.service';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { LocationType } from '../../../models/location.model';
import { FilterService } from '../../../services/filter.service';
import { NotificationService } from '../../../notification';

/**
 * Listing card component for displaying marketplace listings.
 * 
 * Displays listing information including images, title, price, location, and category.
 * Supports favorite functionality, selection mode, and category/location filtering.
 */
@Component({
	selector: 'mm-listing-card',
	templateUrl: 'app-listing-card.component.html',
	styleUrls: ['app-listing-card.component.scss'],
	animations: [fadeSlideIn],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingCardComponent implements OnInit, OnDestroy {

	/**
	 * Sets the listing data and updates internal state.
	 * Automatically determines icon name and deleted status.
	 * 
	 * @param listing - The listing object to display
	 */
	@Input('listing') set setListing(listing: Listing) {
		this.listing = listing;
		this.iconName = getIconName(listing?.category.name);
		this.isDeleted = listing.is_deleted ?? false;
		this.cdr.markForCheck();
	}

	/** Whether to show the favorite icon */
	@Input() showFavoriteIcon: boolean = true;
	
	/** Whether the card is in selection mode (for bulk operations) */
	@Input() isSelectionMode: boolean = false;
	
	isDeleted: boolean = true;
	
	/** Event emitted when the card is selected/deselected in selection mode */
	@Output() onSelect: EventEmitter<{ isSelected: boolean, id: number | undefined }>
			= new EventEmitter<{ isSelected: boolean, id: number | undefined }>();
	
	isSelected: boolean = false;

	listing: Listing | undefined;
	renderBrokenImage = false;
	iconName: string = '';
	destroy$: Subject<void> = new Subject();

	constructor(private cdr: ChangeDetectorRef,
							private favoriteService: FavoriteService,
							private authService: AuthService,
							private router: Router,
							private filterService: FilterService,
							private notificationService: NotificationService,
	) {
	}

	ngOnInit() {
	}

	/**
	 * Handles card click event.
	 * In selection mode, toggles selection state. Otherwise navigates to listing details.
	 */
	onItemClick() {
		if (this.isSelectionMode) {
			this.isSelected = !this.isSelected;
			this.onSelect.emit({ isSelected: this.isSelected, id: this.listing?.id });
			this.cdr.markForCheck();
		}
	}

	/**
	 * Handles category icon click.
	 * Updates filter service with category ID and navigates to home page.
	 */
	onCategoryIconClick() {
		if (this.listing?.category.id) {
			this.filterService.updateFilter({ category_id: this.listing?.category.id });
		}
		this.router.navigate([AppUrls.HOME])
				.then(r => null)
	}

	/**
	 * Handles favorite icon click.
	 * If user is not authenticated, redirects to login.
	 * Otherwise toggles favorite status and shows notification.
	 */
	onFavoriteIconClick() {
		if (!this.authService.Authenticated) {
			this.router.navigate([AppUrls.AUTH.BASE,AppUrls.AUTH.LOGIN],
					{ queryParams: { redirect: this.router.url } }).then(r => null)
			return;
		}
		this.favoriteService.setUnsetFavorite(this.listing?.id ?? 0)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						if (this.listing) {
							this.listing.is_favorite =
									res.body?.data?.is_favorite ?? false;

							if (this.listing.is_favorite) {
								this.notificationService.success({
									message: `Added to favorites`,
								});

							} else {
								this.notificationService.success({
									message: `Removed form Favorites`,
								});

							}
							this.cdr.markForCheck();
						}
					}
				})

	}

	/**
	 * Handles location click (city, state, or country).
	 * Updates filter service with the selected location and navigates to home.
	 * 
	 * @param type - The type of location (CITY, STATE, or COUNTRY)
	 * @param id - The location ID
	 */
	onLocationClick(type: LocationType, id: number | undefined) {
		if (!id) {
			return;
			// TODO :: Notification service!!
		}
		switch (type) {
			case 'CITY':
				this.filterService.updateFilter({ city_id: id });
				break;
			case 'STATE':
				this.filterService.updateFilter({ state_id: id });
				break;
			case 'COUNTRY':
				this.filterService.updateFilter({ country_id: id });
				break;
		}
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}