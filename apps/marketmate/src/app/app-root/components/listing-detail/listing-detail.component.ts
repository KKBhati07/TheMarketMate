import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, debounceTime, Subject, takeUntil } from 'rxjs';
import {
	SHARED_UI_DEPS,
	FormatTextPipe,
	PillComponent,
	getColors,
	getIconName,
	AppButtonComponent,
	handleKeyboardActivation,
	FilterService,
	AuthService,
	NotificationService,
	FavoriteService,
	DeviceDetectorService,
	ImageViewerComponent
} from '@marketmate/shared';
import { AppUrls as SharedUrls } from '@marketmate/shared';
import { AppUrls } from '../../../app.urls';
import { ListingService } from '../../../services/listing.service';
import { ListingDetail } from '../../../models/listing-detail.model';
import { ListingDetailSkeletonComponent } from '../listing-detail-skeleton/listing-detail-skeleton.component';
import { MatDialog } from '@angular/material/dialog';
import {
	ContactMethod,
	ContactOptionsDialogComponent
} from '../../../app-util/components/contact-options-dialog/contact-options-dialog.component';
import {
	ContactEmailDialogComponent,
	ContactEmailDraft
} from '../../../app-util/components/contact-email-dialog/contact-email-dialog.component';

@Component({
	selector: 'mm-listing-detail',
	templateUrl: './listing-detail.component.html',
	styleUrls: ['./listing-detail.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		...SHARED_UI_DEPS,
		FormatTextPipe,
		PillComponent,
		MatButtonModule,
		AppButtonComponent,
		ListingDetailSkeletonComponent
	]
})
export class ListingDetailComponent implements OnInit, OnDestroy {

	listing: ListingDetail | null = null;
	loading = true;
	error = false;
	selectedImageIndex = 0;
	private listingId: number | null = null;
	private destroy$ = new Subject<void>();
	private favoriteIntent$ = new Subject<boolean>();
	protected readonly getColors = getColors;
	protected readonly getIconName = getIconName;
	lastConfirmedFavoriteState: boolean = false;
	isMobile: boolean = false;

	constructor(
			private route: ActivatedRoute,
			private router: Router,
			private listingService: ListingService,
			private cdr: ChangeDetectorRef,
			private filterService: FilterService,
			private authService: AuthService,
			private dialog: MatDialog,
			private notificationService: NotificationService,
			private favoriteService: FavoriteService,
			private deviceDetectorService: DeviceDetectorService
	) {
	}

	ngOnInit(): void {
		this.setIsMobile();
		this.subscribeToFavoriteIntent();
		this.getListingIdFromParams();

	}

	setIsMobile() {
		this.deviceDetectorService.isMobile()
				.pipe(takeUntil(this.destroy$))
				.subscribe(isMobile => {
					this.isMobile = isMobile;
					this.cdr.markForCheck();
				});
	}

	subscribeToFavoriteIntent(): void {
		this.favoriteIntent$
				.pipe(
						debounceTime(800),
						concatMap(isFavorite =>
								this.favoriteService
										.setFavorite(this.listingId!, isFavorite)
										.pipe(takeUntil(this.destroy$))
						)
				)
				.subscribe(res => {
					if (!this.listing) return;
					if (res.isSuccessful()) {
						this.listing.is_favorite = this.lastConfirmedFavoriteState =
								res.body?.data?.is_favorite ?? (this.listing.is_favorite ?? false);
					} else {
						this.listing.is_favorite = this.lastConfirmedFavoriteState;
						this.notificationService.error({ message: 'Failed to update favorite' });
					}
					this.cdr.markForCheck();
				});
	}

	onFavoriteIconClick(): void {
		if (!this.authService.Authenticated) {
			this.router.navigate([SharedUrls.AUTH.BASE, SharedUrls.AUTH.LOGIN],
					{ queryParams: { redirect: this.router.url } }).then(() => null);
			return;
		}
		if (!this.listing || !this.listingId) return;

		const next = !(this.listing.is_favorite ?? false);
		this.listing.is_favorite = next;
		this.cdr.markForCheck();
		this.favoriteIntent$.next(next);
	}

	onFavoriteKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onFavoriteIconClick(), event);
	}

	openImageViewer() {
		if (!this.allImages.length) return;
		this.dialog.open(ImageViewerComponent, {
			data: {
				images: this.allImages.map(i => i.url),
				startIndex: this.selectedImageIndex,
			},
			panelClass: 'full-screen-dialog',
			hasBackdrop: true,
			width: '100vw',
			height: '100vh',
			autoFocus: false,
			restoreFocus: true,
		});
	}

	onMainImageKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.openImageViewer(), event);
	}

	getListingIdFromParams(): void {
		const id = this.route.snapshot.paramMap.get('id');
		if (!id) {
			this.router.navigate([AppUrls.HOME]).then(() => null);
			return;
		}
		const numericId = Number(id);
		if (Number.isNaN(numericId)) {
			this.router.navigate([AppUrls.HOME]).then(() => null);
			return;
		}
		this.listingId = numericId;

		this.getListing(numericId);
	}

	onContactBtnClick(): void {
		if (this.authService.Authenticated) {
			const dialogRef = this.dialog.open(ContactOptionsDialogComponent, {
				panelClass: 'mm-contact-options-dialog-panel',
				autoFocus: false,
				restoreFocus: true,
				data: {
					listingTitle: this.listing?.title ?? '',
					sellerName: this.listing?.seller?.name ?? '',
				},
			});

			dialogRef.afterClosed()
					.pipe(takeUntil(this.destroy$))
					.subscribe((method: ContactMethod | null | undefined) => {
						if (!method) return;
						// TODO: implement actual flows
						if (method === 'EMAIL') {
							const currentUrl = typeof window !== 'undefined' ? window.location.href : this.router.url;
							const emailRef = this.dialog.open(ContactEmailDialogComponent, {
								panelClass: 'mm-contact-email-dialog-panel',
								autoFocus: false,
								restoreFocus: true,
								data: {
									listingTitle: this.listing?.title ?? '',
									sellerName: this.listing?.seller?.name ?? '',
									currentUrl,
								}
							});

							emailRef.afterClosed()
									.pipe(takeUntil(this.destroy$))
									.subscribe((draft: ContactEmailDraft | null | undefined) => {
										if (!draft) return;
										if (!this.listingId) return;
										this.listingService.contactSellerByEmail(this.listingId, {
											...draft,
											listing_url: currentUrl,
										})
												.pipe(takeUntil(this.destroy$))
												.subscribe(res => {
													if (res.isSuccessful()) {
														this.notificationService.success({ message: 'Email sent successfully' });
													} else if (res.status === 401) {
														// session may have expired; send user to login
														this.router.navigate([SharedUrls.AUTH.BASE, SharedUrls.AUTH.LOGIN],
																{ queryParams: { redirect: this.router.url } }).then(() => null);
													} else {
														this.notificationService.error({ message: 'Failed to send email. Please try again.' });
													}
												});
									});
						} else if (method === 'CHAT') {
							this.router.navigate([AppUrls.CHAT], {
								queryParams: { userId: this.listing?.seller?.uuid }
							});
						}
					});
			return;
		}
		// redirect user to the login page (and come back here after login)
		this.router.navigate([SharedUrls.AUTH.BASE, SharedUrls.AUTH.LOGIN],
				{ queryParams: { redirect: this.router.url } }).then(() => null);
	}


	getListing(listingId: number) {
		this.listingService.getOne(listingId)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.listing = res.body?.data ?? null;
						this.lastConfirmedFavoriteState = this.listing?.is_favorite ?? false;
						this.loading = false;
						this.cdr.detectChanges();
					}
				});
	}

	onCategoriesClick() {
		if (this.listing?.category?.id) {
			this.filterService.updateFilter({ category_id: this.listing?.category.id });
		}
		this.router.navigate([AppUrls.HOME])
				.then(r => null)
	}

	onCategoryKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onCategoriesClick(), event);
	}

	get coverOrFirstImageUrl(): string | undefined {
		if (!this.listing?.images?.length) return undefined;
		const cover = this.listing.images.find(i => i.cover ?? i.isCover);
		return cover?.url ?? this.listing.images[0]?.url;
	}

	get allImages(): { url: string }[] {
		if (!this.listing?.images?.length) {
			const c = this.coverOrFirstImageUrl;
			return c ? [{ url: c }] : [];
		}
		return this.listing.images.map(i => ({ url: i.url }));
	}

	selectImage(index: number): void {
		this.selectedImageIndex = index;
		this.cdr.markForCheck();
	}

	get postedAtFormatted(): string {
		const raw = this.listing?.postedAt ?? this.listing?.posted_at;
		if (!raw) return '';
		const d = new Date(raw);
		return isNaN(d.getTime()) ? raw : d.toLocaleDateString(undefined, {
			dateStyle: 'medium'
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
