import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {UpdateUserPayload, User} from "../../../models/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
    @Inject(MAT_DIALOG_DATA) public data: { userDetails: User }
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
    this.userDetails = this.data.userDetails
    this.setUserDetails(this.userDetails)
  }

  setUserDetails(user: User | null) {
    this.userDetails = user;
    if (user) {
      this.editProfileForm.patchValue({
        name: user.name,
        email: user.email,
        contactNo: user.contactNo,
      });
      this.previewUrl = user.profileUrl || null;
    }
    this.isLoading = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
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
      console.warn('NO CHANGES DETECTED !!');
      return;
    }
    const updatedPayload: UpdateUserPayload = {
      uuid: this.userDetails?.uuid ?? '',
      name: formValues.name,
      email: formValues.email,
    };


    const formData = new FormData();
    formData.append("uuid", this.userDetails?.uuid ?? "");
    formData.append("name", formValues.name);
    formData.append("email", formValues.email);
    if (formValues.contactNo !== this.userDetails?.contactNo) {
      formData.append("contactNo", formValues.contactNo);
    }
    if (this.selectedFile) {
      formData.append("profileImage", this.selectedFile);
    }
    this.closeDialog(formData);
    this.closeDialog(formData);

  }

  areValuesChanged(formValues: any) {
    return formValues.name !== this.userDetails?.name ||
      formValues.email !== this.userDetails?.email ||
      formValues.contactNo !== this.userDetails?.contactNo ||
      this.selectedFile;
  }

  closeDialog(data: FormData | null = null) {
    this.dialogRef.close(data);
  }
}
