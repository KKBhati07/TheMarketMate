import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Listing, LoggingService, NotificationService } from 'mm-shared';
import { map, Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { AppUrls } from '../../../utils/app.urls';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'mm-admin-listing',
	templateUrl: './listing.component.html',
	styleUrls: ['./listing.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingComponent implements OnInit, OnDestroy {

	listings: Listing[] = [];
	isSelectionMode = false;
	destroy$: Subject<void> = new Subject<void>();
	queryParams: Record<string, string | number | boolean> = {}
	selectedListings: number[] = [];
	isDeletedListingPage: boolean = false;

	protected readonly AppUrls = AppUrls;

	constructor(
			private adminService: AdminService,
			private cdr: ChangeDetectorRef,
			private route: ActivatedRoute,
			private notificationService: NotificationService,
			private logger: LoggingService,
	) {
	}

	ngOnInit() {
		this.subscribeToParamChange();
	}

	subscribeToParamChange() {
		this.route.queryParamMap.pipe(
				takeUntil(this.destroy$),
				map(qpm => {
					const raw = qpm.get('posts') ?? 'all';
					return raw.toLowerCase() === 'deleted';
				}),
				distinctUntilChanged()
		).subscribe(deleted => {
			this.isDeletedListingPage = deleted;
			this.getListings(deleted);
		})
	}

	getListings(deleted: boolean = false) {
		this.queryParams['deleted'] = deleted;
		this.adminService.getAllListings(this.queryParams)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
						res => {
							if (res.isSuccessful()) {
								this.listings = res.body?.data.items ?? [];
								this.cdr.markForCheck();
							} else {
								this.logger.warn('Failed to load listings (admin)', {
									deleted,
									status: res.status,
									statusText: res.statusText,
								});
								this.notificationService.error({
									message: 'Failed to load listings. Please try again.',
								});
							}
						}
				)
	}

	onListingSelect({ isSelected, id }: { isSelected: boolean, id: number | undefined }) {
		if (!id) return;
		if (isSelected) {
			this.selectedListings.push(id)
		} else {
			this.selectedListings = this.selectedListings.filter(l => l != id);
		}
	}

	onDeleteClick() {
		if (!this.isSelectionMode || !this.selectedListings.length) return;
		this.adminService.deleteListings(this.selectedListings)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.notificationService.success({
							message: `Listings deleted`,
						});

					} else {
						this.logger.warn('Listing deletion failed', { ids: this.selectedListings, status: res.status, statusText: res.statusText });
						this.notificationService.error({
							message: `Listing deletion failed!`,
						});
					}
					this.cdr.markForCheck();
				})
	}

	toggleSelectButton() {
		if (this.isDeletedListingPage) return;
		this.isSelectionMode = !this.isSelectionMode;
		this.cdr.markForCheck();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
