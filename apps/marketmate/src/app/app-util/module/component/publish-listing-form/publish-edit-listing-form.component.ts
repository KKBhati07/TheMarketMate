import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
	Category, City, Country, LoggingService, NotificationService, State, SHARED_UI_DEPS, ImagePreviewComponent,
	Condition, PillComponent, getColors, FormatTextPipe
} from '@marketmate/shared';
import { LocationApiService } from '../../../../services/location.service';
import { CategoryService } from '../../../../services/category.service';
import { catchError, debounceTime, forkJoin, map, of, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { CONSTANTS } from '../../../../app.constants';
import { ProductImage } from '../../../../types/common.type';
import { ListingService } from '../../../../services/listing.service';
import { StorageService, Directory } from '@marketmate/shared';
import { FilePayload } from '@marketmate/shared';
import { PayloadImage } from '../../../../models/listing.model';
import { ImageUploadIconComponent } from '../image-upload-icon/image-upload-icon.component';
import { AutocompleteSelectComponent } from '../app-autocomplete-select/app-autocomplete-select.component';
import { AppButtonComponent } from '@marketmate/shared';

@Component({
	selector: 'mm-publish-listing-form',
	templateUrl: './publish-edit-listing-form.component.html',
	styleUrls: ['./publish-edit-listing-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		...SHARED_UI_DEPS,
		ReactiveFormsModule,
		ImageUploadIconComponent,
		ImagePreviewComponent,
		AutocompleteSelectComponent,
		AppButtonComponent,
		PillComponent,
		FormatTextPipe
	]
})
export class PublishEditListingFormComponent implements OnInit, OnDestroy {
	createListingForm!: FormGroup;
	isMobile = false;
	isDragOver = false;
	categories: Category[] = [];
	countries: Country[] = [];
	states: State[] = [];
	cities: City[] = [];
	destroy$: Subject<void> = new Subject<void>();
	productImages: ProductImage[] = [];
	productConditions: Condition[] = [];
	protected readonly CONSTANTS = CONSTANTS;
	isLoading = false;

	constructor(
			private fb: FormBuilder,
			private locationApiService: LocationApiService,
			private listingService: ListingService,
			private storageService: StorageService,
			private categoryService: CategoryService,
			private notificationService: NotificationService,
			private logger: LoggingService,
			private cdr: ChangeDetectorRef,
			private dialogRef: MatDialogRef<PublishEditListingFormComponent>,
			@Inject(MAT_DIALOG_DATA) public data: { isMobile: boolean }
	) {
		this.initForm();
	}

	ngOnInit() {
		this.isMobile = this.data?.isMobile ?? false;
		this.cdr.markForCheck();
		this.getCountries();
		this.getCategories();
		this.getProductConditions();
		this.attachFormValueChangeListener();
	}

	getProductConditions() {
		this.listingService.getConditions()
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.productConditions = res.body?.data.conditions ?? []
					} else {
						this.logger.error('Unalbe to load conditions', res);
						this.notificationService.error({ message: 'Something went wrong!' })
						this.closeDialog();
					}
					this.cdr.markForCheck();
				})
	}

	attachFormValueChangeListener() {
		this.createListingForm.get('countryId')?.valueChanges
				.pipe(
						debounceTime(800),
						takeUntil(this.destroy$)
				)
				.subscribe(countryId => {
					if (countryId) {
						this.states = [];
						this.cities = [];
						this.createListingForm.patchValue({ state: null, city: null });
						this.getStates(countryId);
					}
				});
		this.createListingForm.get('stateId')?.valueChanges
				.pipe(
						debounceTime(800),
						takeUntil(this.destroy$)
				)
				.subscribe(stateCode => {
					if (stateCode) {
						this.cities = [];
						this.createListingForm.patchValue({ city: null });
						this.getCities(stateCode);
					}
				});
	}

	protected onConditionSelectClick(id: number) {
		this.createListingForm.get('conditionId')?.setValue(id)
	}

	initForm() {
		this.createListingForm = this.fb.group({
			title: ['', Validators.required],
			description: [''],
			price: [null, Validators.required],
			categoryId: [null, Validators.required],
			conditionId: [null, Validators.required],
			countryId: [null, Validators.required],
			stateId: [{ value: null, disabled: true }, Validators.required],
			cityId: [{ value: null, disabled: true }, Validators.required],
		});
	}

	getCountries() {
		this.locationApiService.getCountries()
				.pipe(takeUntil(this.destroy$))
				.subscribe(r => {
					if (r.isSuccessful()) {
						this.countries = r.body?.data ?? [];
						this.cdr.markForCheck();
					}
				});
	}

	getCategories() {
		this.categoryService.getCategories()
				.pipe(takeUntil(this.destroy$))
				.subscribe(r => {
					if (r.isSuccessful()) {
						this.categories = r.body?.data?.categories ?? [];
						this.cdr.markForCheck();
					}
				})
	}

	getStates(countryId: number) {
		this.locationApiService.getStates(countryId)
				.pipe(takeUntil(this.destroy$))
				.subscribe(r => {
					if (r.isSuccessful()) {
						this.createListingForm.get('stateId')?.enable();
						this.states = r.body?.data ?? [];
					}
				});
	}

	getCities(stateCode: number) {
		this.locationApiService.getCities(stateCode)
				.pipe(takeUntil(this.destroy$))
				.subscribe(r => {
					if (r.isSuccessful()) {
						this.cities = r.body?.data ?? [];
						this.createListingForm.get('cityId')?.enable();
					}
				});
	}

	onDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.isDragOver = true;
	}

	onDragLeave() {
		this.isDragOver = false;
	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.isDragOver = false;

		if (event.dataTransfer?.files?.length) {
			const files = Array.from(event.dataTransfer.files)
					.filter(file => file.type.startsWith('image/'));
			this.handleImageFiles(files);
		}
	}

	handleImageFiles(files: FileList | File[]): void {
		if (!files) return;
		files = Array.isArray(files) ? files : Array.from(files);
		const remainingSlots =
				CONSTANTS.LISTING.IMAGES.MAX_LIMIT
				- this.productImages.length;
		files = files.slice(0, remainingSlots);

		for (const file of files) {
			const reader = new FileReader();
			reader.onload = () => {
				this.cdr.markForCheck();
				this.productImages.push({
					image: file,
					previewUrl: reader.result as string,
					isCover: this.productImages.length === 0
				})
			};
			reader.readAsDataURL(file);
			this.cdr.markForCheck();
		}

	}

	removeImage(index: number): void {
		this.productImages.splice(index, 1);
	}

	onSubmit() {
		if (this.createListingForm.valid && !this.isLoading) {
			this.isLoading = true;
			this.cdr.markForCheck();
			if (this.productImages.length) {
				const filePayload: FilePayload[] =
						this.productImages.map(i => ({
							file_name: i.image.name,
							content_type: i.image.type,
						} as FilePayload))
				this.storageService.getPresignPutUrl({
					files: filePayload,
					directory: Directory.LISTINGS
				}).pipe(
						takeUntil(this.destroy$),
						switchMap(res => {
							if (!res.isSuccessful()) return throwError(() => new Error("Failed to get presigns"));
							const data = res.body?.data;
							if (!data) return throwError(() => new Error("No data in presign response"));
							if (data.failures.length) {
								this.notificationService.error({
									message: `Some images failed to upload!`,
								});
							}

							const uploadTasks$ = data.presigns.map((p, idx) => {
								const file = this.productImages[idx].image;
								return this.storageService.uploadFileToS3(p.url, file, p.headers).pipe(
										map(() => ({
											object_key: p.object_key,
											is_cover: this.productImages[idx].isCover
										}))
								);
							});
							return forkJoin(uploadTasks$);
						}),
						catchError(e => {
							this.logger.error('Listing publish failed (presign/upload)', e);
							this.notificationService.error({
								message: `Error while listing your item`,
							});

							return of(null)
						}),
						takeUntil(this.destroy$)
				).subscribe(res => {
					if (!res) {
						this.isLoading = false;
						this.cdr.markForCheck();
						return;
					}
					return this.createListing(this.createListingForm.value, res);
				})
			} else {
				this.createListing(this.createListingForm.value)
			}
		}
	}

	createListing(formValue: {
		title: string;
		description: string;
		price: number;
		categoryId: number;
		countryId: number;
		conditionId: number;
		stateId: number;
		cityId: number
	}, images: PayloadImage[] = []) {
		this.listingService.createListing({
			title: formValue.title,
			description: formValue.description,
			category_id: formValue.categoryId,
			country_id: formValue.countryId,
			state_id: formValue.stateId,
			city_id: formValue.cityId,
			condition_id: formValue.conditionId,
			price: formValue.price,
			images
		}).pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.isLoading = false;
					if (res.isSuccessful()) {
						this.createListingForm.reset();
						this.productImages = [];
						this.closeDialog();
						this.cdr.markForCheck();
						this.notificationService.success({
							message: `Item listed!`,
						});
					} else {
						this.notificationService.error({
							message: `Item listing failed!`,
						});
					}
					this.cdr.markForCheck();
				})
	}


	closeDialog() {
		this.dialogRef.close();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	protected readonly getColors = getColors;
}
