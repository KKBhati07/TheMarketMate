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
import { Listing } from '../../../../models/listing.model';
import { getIconName } from '../../../../utils/common.util';
import { Router } from '@angular/router';
import { AppUrls } from '../../../../common.urls';
import { fadeSlideIn } from '../../../../animations/fade-slide-in.animation';
import { FavoriteService } from '../../../../services/favorite.service';
import { AuthService } from '../../../../services/auth.service';
import { concatMap, debounceTime, Subject, takeUntil } from 'rxjs';
import { LocationType } from '../../../../models/location.model';
import { FilterService } from '../../../../services/filter.service';
import { NotificationService } from '../../../../notification';
import { handleKeyboardActivation } from '../../../../utils/keyboard.util';
import { SHARED_UI_DEPS } from '../../../../constants/shared-imports';
import { FormatTextPipe } from '../../../../pipes/format-text.pipe';

@Component({
	selector: 'mm-listing-card',
	templateUrl: 'app-listing-card.component.html',
	styleUrls: ['app-listing-card.component.scss'],
	animations: [fadeSlideIn],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, FormatTextPipe]
})
export class ListingCardComponent implements OnInit, OnDestroy {

	@Input('listing') set setListing(listing: Listing) {
		this.listing = listing;
		this.iconName = getIconName(listing?.category.name);
		this.isDeleted = listing.is_deleted ?? false;
		this.lastConfirmedFavoriteState = listing.is_favorite;
		this.cdr.markForCheck();
	}

	@Input() showFavoriteIcon: boolean = true;
	@Input() isSelectionMode: boolean = false;

	private favoriteIntent$ = new Subject<boolean>();


	isDeleted: boolean = true;

	@Output() onSelect: EventEmitter<{ isSelected: boolean, id: number | undefined }>
			= new EventEmitter<{ isSelected: boolean, id: number | undefined }>();

	isSelected: boolean = false;

	listing: Listing | undefined;
	renderBrokenImage = false;
	iconName: string = '';
	destroy$: Subject<void> = new Subject<void>();
	protected readonly LocationType = LocationType;
	lastConfirmedFavoriteState: boolean = false;

	constructor(private cdr: ChangeDetectorRef,
							private favoriteService: FavoriteService,
							private authService: AuthService,
							private router: Router,
							private filterService: FilterService,
							private notificationService: NotificationService,
	) {
	}

	ngOnInit() {
		this.subscribeToFavoriteIntent();
	}

	subscribeToFavoriteIntent(): void {
		this.favoriteIntent$
				.pipe(
						debounceTime(800),
						// Process one request at a time
						concatMap(isFavorite =>
								this.favoriteService
										.setFavorite(this.listing!.id, isFavorite)
										.pipe(takeUntil(this.destroy$))
						)
				)
				.subscribe(res => {
					if (res.isSuccessful()) {
						if (this.listing) {
							this.listing.is_favorite = this.lastConfirmedFavoriteState =
									res.body?.data?.is_favorite ?? this.listing.is_favorite;

							if (this.listing.is_favorite) {
								this.notificationService.success({
									message: `Added to favorites`,
								});
							} else {
								this.notificationService.success({
									message: `Removed from Favorites`,
								});
							}

							this.cdr.markForCheck();
						}
					} else {
						this.listing!.is_favorite = this.lastConfirmedFavoriteState;
						this.notificationService.error({
							message: 'Failed to update favorite',
						});
						this.cdr.markForCheck();
					}
				});
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
			this.router.navigate([AppUrls.AUTH.BASE, AppUrls.AUTH.LOGIN],
					{ queryParams: { redirect: this.router.url } }).then(r => null);
			return;
		}

		if (!this.listing) return;
		const next = !this.listing.is_favorite;
		this.listing.is_favorite = next;
		this.cdr.markForCheck();
		this.favoriteIntent$.next(next);
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

	onCardKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onItemClick(), event);
	}

	onFavoriteKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onFavoriteIconClick(), event);
	}

	onCategoryKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onCategoryIconClick(), event);
	}

	onLocationKeydown(event: KeyboardEvent, type: LocationType, id: number | undefined) {
		handleKeyboardActivation(() => this.onLocationClick(type, id), event);
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}