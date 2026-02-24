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
import { getColors, getIconName } from '../../../utils/common.util';
import { Router } from '@angular/router';
import { AppUrls } from '../../../common.urls';
import { fadeSlideIn } from '../../../animations/fade-slide-in.animation';
import { FavoriteService } from '../../../services/favorite.service';
import { AuthService } from '../../../services/auth.service';
import { concatMap, debounceTime, Subject, takeUntil } from 'rxjs';
import { LocationType } from '../../../models/location.model';
import { FilterService } from '../../../services/filter.service';
import { NotificationService } from '../../../notification';
import { handleKeyboardActivation } from '../../../utils/keyboard.util';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';
import { FormatTextPipe } from '../../../pipes/format-text.pipe';
import { PillComponent } from '../../ui/app-pill/pill.component';

@Component({
	selector: 'mm-listing-card',
	templateUrl: 'app-listing-card.component.html',
	styleUrls: ['app-listing-card.component.scss'],
	animations: [fadeSlideIn],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, FormatTextPipe, PillComponent]
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

	protected readonly getColors = getColors;

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

							this.cdr.markForCheck();
						}
					} else {
						this.listing!.is_favorite = this.lastConfirmedFavoriteState;
						this.notificationService.error({
							message: 'Failed to update favorite, Please retry!',
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
		} else if (this.listing?.id != null) {
			this.router.navigate([AppUrls.LISTING.DETAIL(this.listing.id)]).then(() => null);
		}
	}

	onCategoryIconClick() {
		if (this.listing?.category.id) {
			this.filterService.updateFilter({ category_id: this.listing?.category.id });
		}
		this.router.navigate([AppUrls.HOME])
				.then(r => null)
	}

	onFavoriteIconClick(event: Event) {
		event.stopPropagation();
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
		handleKeyboardActivation(() => this.onFavoriteIconClick(event), event);
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