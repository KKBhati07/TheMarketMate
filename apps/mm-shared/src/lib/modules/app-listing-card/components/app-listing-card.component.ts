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

@Component({
	selector: 'mm-listing-card',
	templateUrl: 'app-listing-card.component.html',
	styleUrls: ['app-listing-card.component.scss'],
	animations: [fadeSlideIn],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingCardComponent implements OnInit, OnDestroy {

	/**
	 * Side effect: Updates icon name and deleted status when listing changes.
	 */
	@Input('listing') set setListing(listing: Listing) {
		this.listing = listing;
		this.iconName = getIconName(listing?.category.name);
		this.isDeleted = listing.is_deleted ?? false;
		this.cdr.markForCheck();
	}

	@Input() showFavoriteIcon: boolean = true;
	@Input() isSelectionMode: boolean = false;
	
	isDeleted: boolean = true;
	
	@Output() onSelect: EventEmitter<{ isSelected: boolean, id: number | undefined }>
			= new EventEmitter<{ isSelected: boolean, id: number | undefined }>();
	
	isSelected: boolean = false;

	listing: Listing | undefined;
	renderBrokenImage = false;
	iconName: string = '';
	destroy$: Subject<void> = new Subject();
	isFavoriteLoading = false;
	protected readonly LocationType = LocationType;

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

	onItemClick() {
		if (this.isSelectionMode) {
			this.isSelected = !this.isSelected;
			this.onSelect.emit({ isSelected: this.isSelected, id: this.listing?.id });
			this.cdr.markForCheck();
		}
	}

	onCategoryIconClick() {
		if (this.listing?.category.id) {
			this.filterService.updateFilter({ category_id: this.listing?.category.id });
		}
		this.router.navigate([AppUrls.HOME])
				.then(r => null)
	}

	onFavoriteIconClick() {
		if (!this.authService.Authenticated) {
			this.router.navigate([AppUrls.AUTH.BASE,AppUrls.AUTH.LOGIN],
					{ queryParams: { redirect: this.router.url } }).then(r => null)
			return;
		}
		if (this.isFavoriteLoading) return;
		this.isFavoriteLoading = true;
		this.cdr.markForCheck();
		this.favoriteService.setUnsetFavorite(this.listing?.id ?? 0)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.isFavoriteLoading = false;
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
					} else {
						this.cdr.markForCheck();
					}
				})

	}

	onLocationClick(type: LocationType, id: number | undefined) {
		if (!id) {
			return;
			// TODO :: Notification service!!
		}
		switch (type) {
			case LocationType.CITY:
				this.filterService.updateFilter({ city_id: id });
				break;
			case LocationType.STATE:
				this.filterService.updateFilter({ state_id: id });
				break;
			case LocationType.COUNTRY:
				this.filterService.updateFilter({ country_id: id });
				break;
		}
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}