import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Listing } from '../../models/listing.model';
import { getIconName } from '../../app-util/common.util';
import { Router } from '@angular/router';
import { AppUrls } from '../../app.urls';
import { fadeSlideIn } from '../../app-util/animations/fade-slide-in.animation';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'mm-listing-card',
	templateUrl: 'app-listing-card.component.html',
	styleUrls: ['app-listing-card.component.scss'],
	animations: [fadeSlideIn],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingCardComponent implements OnInit, OnDestroy {

	constructor(private cdr: ChangeDetectorRef,
							private favoriteService: FavoriteService,
							private authService: AuthService,
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
	destroy$: Subject<void> = new Subject();

	ngOnInit() {
	}

	onCategoryIconClick() {
		this.router.navigate(
				[AppUrls.HOME],
				{
					queryParams: { category_id: this.listing?.category.id }
				}).then(r => null);
	}

	onFavoriteIconClick() {
		if (!this.authService.Authenticated) {
			this.router.navigate(AppUrls.AUTH.LOGIN.split('/'),
					{ queryParams: { redirect: this.router.url } }).then(r => null)
			return;
		}
		this.favoriteService.setUnsetFavorite(this.listing?.id ?? 0 )
				.pipe(takeUntil(this.destroy$))
				.subscribe(res=>{
					if(res.isSuccessful()){
						// TODO :: Notify user
						if(this.listing){
							this.listing.is_favorite =
									res.body?.data?.is_favorite ?? false;
							this.cdr.markForCheck();
						}
					}
		})

	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}