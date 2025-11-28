import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ListingService } from '../../../services/listing.service';
import { Listing } from '../../../models/listing.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'mm-admin-listing',
	templateUrl: './admin-listing.component.html',
	styleUrls: ['./admin-listing.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminListingComponent implements OnInit, OnDestroy {

	listings: Listing[] = [];
	isSelectionMode = true;
	destroy$: Subject<void> = new Subject<void>();
	queryParams: Record<string, string | number> = {}

	constructor(
			private listingService: ListingService,
			private cdr: ChangeDetectorRef,
	) {
	}

	ngOnInit() {
		this.getListings();
	}

	getListings() {
		this.listingService.getAllForAdmin(this.queryParams)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
						res => {
							if (res.isSuccessful()) {
								this.listings = res.body?.data.items ?? [];
								this.cdr.markForCheck();
							}
						}
				)
	}

	toggleSelectButton() {
		this.isSelectionMode = !this.isSelectionMode;
		this.cdr.markForCheck();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
