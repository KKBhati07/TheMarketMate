import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { City, Country, NotificationService, State } from 'mm-shared';
import { LocationApiService } from '../../../../services/location.service';
import { CategoryService } from '../../../../services/category.service';
import { catchError, debounceTime, forkJoin, map, of, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { CONSTANTS } from '../../../../app.constants';
import { ProductImage } from '../../../../types/common.type';
import { ListingService } from '../../../../services/listing.service';
import { StorageService } from 'mm-shared';
import { FilePayload } from 'mm-shared';
import { PayloadImage } from '../../../../models/listing.model';

@Component({
	selector: 'mm-publish-listing-form',
	templateUrl: './publish-edit-listing-form.component.html',
	styleUrls: ['./publish-edit-listing-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublishEditListingFormComponent implements OnInit, OnDestroy {
	createListingForm!: FormGroup;
	isMobile = false;
	isDragOver = false;
	categories: any[] = [];
	countries: Country[] = [];
	states: State[] = [];
	cities: City[] = [];
	destroy$: Subject<void> = new Subject<void>();
	productImages: ProductImage[] = [];
	protected readonly CONSTANTS = CONSTANTS;

	constructor(
			private fb: FormBuilder,
			private locationApiService: LocationApiService,
			private listingService: ListingService,
			private storageService: StorageService,
			private categoryService: CategoryService,
			private notificationService: NotificationService,
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
		this.attachFormValueChangeListener();
	}

	attachFormValueChangeListener() {
		this.createListingForm.get('countryId')?.valueChanges
				.pipe(debounceTime(800))
				.subscribe(countryId => {
					console.warn('Called !!s')
					if (countryId) {
						this.states = [];
						this.cities = [];
						this.createListingForm.patchValue({ state: null, city: null });
						this.getStates(countryId);
					}
				});
		this.createListingForm.get('stateId')?.valueChanges
				.pipe(debounceTime(800))
				.subscribe(stateCode => {
					if (stateCode) {
						this.cities = [];
						this.createListingForm.patchValue({ city: null });
						this.getCities(stateCode);
					}
				});
	}

	initForm() {
		this.createListingForm = this.fb.group({
			title: ['', Validators.required],
			description: [''],
			price: [null, Validators.required],
			categoryId: [null, Validators.required],
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

	getStates(countryId: string) {
		this.locationApiService.getStates(countryId)
				.pipe(takeUntil(this.destroy$))
				.subscribe(r => {
					if (r.isSuccessful()) {
						this.createListingForm.get('stateId')?.enable();
						this.states = r.body?.data ?? [];
					}
				});
	}

	getCities(stateCode: string) {
		this.locationApiService.getCities(stateCode).subscribe(r => {
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
		if (this.createListingForm.valid) {
			if (this.productImages.length) {
				const filePayload: FilePayload[] =
						this.productImages.map(i => ({
							file_name: i.image.name,
							content_type: i.image.type,
						} as FilePayload))
				this.storageService.getPresignPutUrl({
					files: filePayload,
					directory: 'LISTINGS'
				}).pipe(
						takeUntil(this.destroy$),
						switchMap(res => {
							if (!res.isSuccessful()) return throwError(() => new Error("Failed to get presigns"));
							const data = res.body?.data!;
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
							this.notificationService.error({
								message: `Error while listing your item`,
							});

							return of(null)
						})
				).subscribe(res => {
					if (!res) return
					return this.createListing(this.createListingForm.value, res);
				})
			} else {
				this.createListing(this.createListingForm.value)
			}
		}
	}

	createListing(formValue: any, images: PayloadImage[] = []) {
		this.listingService.createListing({
			title: formValue.title,
			description: formValue.description,
			category_id: formValue.categoryId,
			country_id: formValue.countryId,
			state_id: formValue.stateId,
			city_id: formValue.cityId,
			price: formValue.price,
			images
		}).pipe(takeUntil(this.destroy$))
				.subscribe(res => {
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
				})
	}


	closeDialog() {
		this.dialogRef.close();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
