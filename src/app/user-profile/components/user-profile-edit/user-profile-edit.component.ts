import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { UpdateUserPayload, User } from "../../../shared/models/user.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

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
			private dialogRef: MatDialogRef<UserProfileEditComponent>,
			@Inject(MAT_DIALOG_DATA) public data: { userDetails: User, isMobile: boolean }
	) {
		this.initForm();
	}

	ngOnInit() {
		this.getAndSetUserDetails();
	}

	initForm() {
		this.editProfileForm = this.fb.group({
			name: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			contactNo: ["", [Validators.pattern(/^\+?\d+$/)]],
			profileImage: [""],
		});
	}

	getAndSetUserDetails() {
		this.userDetails = this.data.userDetails;
		this.setUserDetails(this.userDetails);
		this.isMobile = this.data.isMobile;
	}

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

	onDragOver(event: DragEvent) {
		event.preventDefault();
		this.isDragOver = true;
	}

	onDragLeave() {
		this.isDragOver = false;
	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		this.isDragOver = false;

		if (event.dataTransfer?.files.length) {
			const file = event.dataTransfer.files[0];
			this.onFileSelected(null, file)
		}
	}


	onFileSelected(event: any, file: any = null) {
		if (!file) {
			file = event.target.files[0];
		}
		if (file) {
			if (!file.type.startsWith('image/')) {
				console.warn("Please select a valid image file.");
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

	async onSubmit() {
		if (this.editProfileForm.invalid && !this.userDetails) return;
		const formValues = this.editProfileForm.value;
		if (!this.areValuesChanged(formValues)) {
			return;
		}
		const updatedPayload = this.getUpdatedPayload(formValues);
		this.closeDialog(updatedPayload);

	}

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

	areValuesChanged(formValues: any) {
		return formValues.name !== this.userDetails?.name ||
				formValues.email !== this.userDetails?.email ||
				formValues.contactNo !== this.userDetails?.contact_no ||
				this.selectedFile;
	}

	closeDialog(updatedPayload: UpdateUserPayload | null = null) {
		this.dialogRef.close(updatedPayload);
	}
}
