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
import { Listing } from '../../shared/models/listing.model';
import { getIconName } from '../../app-util/common.util';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUrls } from '../../app.urls';
import { fadeSlideIn } from '../../app-util/animations/fade-slide-in.animation';
import { FavoriteService } from '../../shared/services/favorite.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { LocationType } from '../../shared/models/location.model';
import { FilterService } from '../../shared/services/filter.service';

@Component({
	selector: 'mm-listing-card',
	templateUrl: 'app-listing-card.component.html',
	styleUrls: ['app-listing-card.component.scss'],
	animations: [fadeSlideIn],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingCardComponent implements OnInit, OnDestroy {

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

	constructor(private cdr: ChangeDetectorRef,
							private favoriteService: FavoriteService,
							private authService: AuthService,
							private router: Router,
							private filterService: FilterService,
							private route: ActivatedRoute,
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
			this.router.navigate(AppUrls.AUTH.LOGIN.split('/'),
					{ queryParams: { redirect: this.router.url } }).then(r => null)
			return;
		}
		this.favoriteService.setUnsetFavorite(this.listing?.id ?? 0)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						// TODO :: Notify user
						if (this.listing) {
							this.listing.is_favorite =
									res.body?.data?.is_favorite ?? false;
							this.cdr.markForCheck();
						}
					}
				})

	}

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