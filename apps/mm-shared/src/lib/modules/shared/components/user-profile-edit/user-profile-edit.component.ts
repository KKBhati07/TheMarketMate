import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { UpdateUserPayload, User } from "../../../../models/user.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../../../notification";

/**
 * User profile edit dialog component.
 * 
 * Provides a form for editing user profile information including name, email,
 * contact number, and profile image. Supports drag-and-drop image upload.
 */
@Component({
	selector: "mm-user-profile-edit",
	templateUrl: "./user-profile-edit.component.html",
	styleUrls: ["./user-profile-edit.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileEditComponent implements OnInit {
	userDetails: User | null = null;
	editProfileForm!: FormGroup;
	isLoading = true;
	selectedFile: File | null = null;
	previewUrl: string | ArrayBuffer | null = null;
	isMobile: boolean = false;

	constructor(
			private cdr: ChangeDetectorRef,
			private fb: FormBuilder,
			private notificationService: NotificationService,
			private dialogRef: MatDialogRef<UserProfileEditComponent>,
			@Inject(MAT_DIALOG_DATA) public data: { userDetails: User, isMobile: boolean }
	) {
		this.initForm();
	}

	ngOnInit() {
		this.getAndSetUserDetails();
	}

	/**
	 * Initializes the reactive form with validation rules.
	 */
	initForm() {
		this.editProfileForm = this.fb.group({
			name: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			contactNo: ["", [Validators.pattern(/^\+?\d+$/)]],
			profileImage: [""],
		});
	}

	/**
	 * Loads user details from dialog data and populates the form.
	 */
	getAndSetUserDetails() {
		this.userDetails = this.data.userDetails;
		this.setUserDetails(this.userDetails);
		this.isMobile = this.data.isMobile;
	}

	/**
	 * Sets user details and populates the form fields.
	 * 
	 * @param user - The user object to populate the form with
	 */
	setUserDetails(user: User | null) {
		this.userDetails = user;
		if (user) {
			this.editProfileForm.patchValue({
				name: user.name,
				email: user.email,
				contactNo: user.contact_no,
			});
			this.previewUrl = user.profile_url || null;
		}
		this.isLoading = false;
	}

	isDragOver = false

	/**
	 * Handles drag over event for file drop zone.
	 * 
	 * @param event - The drag event
	 */
	onDragOver(event: DragEvent) {
		event.preventDefault();
		this.isDragOver = true;
	}

	/**
	 * Handles drag leave event for file drop zone.
	 */
	onDragLeave() {
		this.isDragOver = false;
	}

	/**
	 * Handles file drop event.
	 * 
	 * @param event - The drop event
	 */
	onDrop(event: DragEvent) {
		event.preventDefault();
		this.isDragOver = false;

		if (event.dataTransfer?.files.length) {
			const file = event.dataTransfer.files[0];
			this.onFileSelected(null, file)
		}
	}

	/**
	 * Handles file selection from input or drag-and-drop.
	 * Validates file type and generates preview.
	 * 
	 * @param event - File input change event (optional)
	 * @param file - File object (optional, for drag-and-drop)
	 */
	onFileSelected(event: any, file: any = null) {
		if (!file) {
			file = event.target.files[0];
		}
		if (file) {
			if (!file.type.startsWith('image/')) {
				this.notificationService.error({
					message: 'Please select a valid image file.',
				});
				return;
			}
			this.selectedFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				this.previewUrl = reader.result;
				this.cdr.markForCheck();
			};
			reader.readAsDataURL(file);
		}
	}

	/**
	 * Handles form submission.
	 * Validates form, checks for changes, and closes dialog with updated payload.
	 */
	async onSubmit() {
		if (this.editProfileForm.invalid && !this.userDetails) return;
		const formValues = this.editProfileForm.value;
		if (!this.areValuesChanged(formValues)) {
			return;
		}
		const updatedPayload = this.getUpdatedPayload(formValues);
		this.closeDialog(updatedPayload);

	}

	/**
	 * Builds the update payload with only changed fields.
	 * 
	 * @param formValues - Current form values
	 * @returns Update payload containing only changed fields
	 */
	private getUpdatedPayload(formValues: any) {
		const updatedPayload: UpdateUserPayload = { uuid: this.userDetails?.uuid ?? '' }

		if (formValues.name !== this.userDetails?.name) {
			updatedPayload.name = formValues.name;
		}
		if (formValues.email !== this.userDetails?.email) {
			updatedPayload.email = formValues.email;
		}
		if (formValues.contactNo !== this.userDetails?.contact_no) {
			updatedPayload.contact_no = formValues.contactNo;
		}
		if (this.selectedFile) {
			updatedPayload.profileImage = this.selectedFile;
		}

		return updatedPayload;
	}

	/**
	 * Checks if any form values have changed from the original user data.
	 * 
	 * @param formValues - Current form values
	 * @returns True if any values have changed, false otherwise
	 */
	areValuesChanged(formValues: any) {
		return formValues.name !== this.userDetails?.name ||
				formValues.email !== this.userDetails?.email ||
				formValues.contactNo !== this.userDetails?.contact_no ||
				this.selectedFile;
	}

	/**
	 * Closes the dialog and returns the update payload.
	 * 
	 * @param updatedPayload - The payload with updated user data, or null if cancelled
	 */
	closeDialog(updatedPayload: UpdateUserPayload | null = null) {
		this.dialogRef.close(updatedPayload);
	}
}
