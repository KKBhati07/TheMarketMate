import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { City, Country, State } from '../../../models/location.model';
import { LocationApiService } from '../../../services/location.service';
import { CategoryService } from '../../../services/category.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CONSTANTS } from '../../../app.constants';
import { ProductImage } from '../../../models/common.model';
import { ListingService } from '../../../services/listing.service';

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
			private categoryService: CategoryService,
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
			const formValue = this.createListingForm.value;
			const formData = new FormData();
			formData.append('title', formValue.title);
			formData.append('description', formValue.description || '');
			formData.append('price', formValue.price);
			formData.append('categoryId', formValue.categoryId);
			formData.append('countryId', formValue.countryId);
			formData.append('stateId', formValue.stateId);
			formData.append('cityId', formValue.cityId);
			this.productImages.forEach((img, index) => {
				formData.append(`images[${ index }].image`, img.image);
				formData.append(`images[${ index }].cover`, String(img.isCover));
			});

			this.listingService.createListing(formData)
					.pipe(takeUntil(this.destroy$))
					.subscribe(res => {
						if (res.isSuccessful()) {
							this.createListingForm.reset();
							this.productImages = [];
							this.closeDialog();
							this.cdr.markForCheck();
							// TODO :: Attach notifications!
						}
					})
		}
	}


	closeDialog() {
		this.dialogRef.close();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
