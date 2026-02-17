import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
	SHARED_UI_DEPS,
	FormatTextPipe,
	PillComponent,
	getColors,
	getIconName, AppButtonComponent
} from '@marketmate/shared';
import { AppUrls } from '../../../app.urls';
import { ListingService } from '../../../services/listing.service';
import { ListingDetail } from '../../../models/listing-detail.model';
import { ListingDetailSkeletonComponent } from '../listing-detail-skeleton/listing-detail-skeleton.component';

@Component({
	selector: 'mm-listing-detail',
	templateUrl: './listing-detail.component.html',
	styleUrls: ['./listing-detail.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, FormatTextPipe, PillComponent, MatButtonModule, AppButtonComponent, ListingDetailSkeletonComponent]
})
export class ListingDetailComponent implements OnInit, OnDestroy {

	listing: ListingDetail | null = null;
	loading = true;
	error = false;
	selectedImageIndex = 0;
	private destroy$ = new Subject<void>();
	protected readonly getColors = getColors;
	protected readonly getIconName = getIconName;

	constructor(
			private route: ActivatedRoute,
			private router: Router,
			private listingService: ListingService,
			private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit(): void {
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

		this.getListing(numericId);

	}

	onContactBtnClick(): void {

	}


	getListing(listingId: number) {
		this.listingService.getOne(listingId)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.listing = res.body?.data ?? null;
						this.loading = false;
						this.cdr.detectChanges();
					}
				});
	}

	onCategoriesClick() {

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
