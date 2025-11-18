import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter, Inject,
	Input,
	OnDestroy,
	OnInit,
	Output
} from "@angular/core";
import { ProfileDetails } from "../../../models/user.model";
import { MatDialog } from "@angular/material/dialog";
import { UserProfileEditComponent } from "../user-profile-edit/user-profile-edit.component";
import { Subject, takeUntil } from "rxjs";
import { UserService } from "../../../services/user.service";
import { AuthService } from "../../../services/auth.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ProfileDetailsBottomSheetData } from '../../../models/bottomsheet.model';
import { ImageViewerComponent } from '../../../shared/components/image-viewer/image-viewer.component';

@Component({
	selector: 'mm-profile-detail',
	templateUrl: './profile-details.component.html',
	styleUrls: ['./profile-details.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

	@Input() isExpanded = false;
	@Input() userDetails: ProfileDetails | null = null;
	@Input() isMobile: boolean = false;
	isBottomSheet = false;
	destroy$: Subject<any> = new Subject();
	renderIcon = false
	@Output() expandComponent = new EventEmitter<boolean>();

	constructor(private cdr: ChangeDetectorRef,
							private userService: UserService,
							private authService: AuthService,
							@Inject(MAT_BOTTOM_SHEET_DATA)
							public data: ProfileDetailsBottomSheetData,
							private bsr: MatBottomSheetRef,
							private dialog: MatDialog) {
	}

	ngOnInit() {
		this.checkForBottomSheet();
	}

	checkForBottomSheet() {
		if (this.data?.isBottomSheet) {
			this.isBottomSheet = this.data.isBottomSheet;
			this.userDetails = this.data.userDetails;
			this.isMobile = this.data.isMobile;
			this.cdr.markForCheck();
		}
	}

	onProfilePicClick() {
		return this.openImageViewerInMatDialog();
	}

	openImageViewerInMatDialog() {
		this.dialog.open(ImageViewerComponent, {
			data: { images: [this.userDetails?.profile_url ?? ''] },
			panelClass: 'full-screen-dialog',
			hasBackdrop: true,
			width: '100vw',
			height: '100vh',
		});
	}

	onEditProfileClick() {
		if (this.isBottomSheet) {
			this.bsr?.dismiss();
		}

		if (this.userDetails) {
			const dialogRef =
					this.dialog.open(UserProfileEditComponent, {
						backdropClass: 'profile-edit-from-backdrop',
						panelClass: this.isMobile ?
								'profile-edit-from-container-mobile'
								: 'profile-edit-from-container',
						hasBackdrop: true,
						data: {
							userDetails: this.userDetails,
							isMobile: this.isMobile
						}
					});
			dialogRef.afterClosed().subscribe((data: FormData | null) => {
				if (data) {
					this.userService.updateUser(data)
							.pipe(takeUntil(this.destroy$))
							.subscribe(res => {
								if (res.isSuccessful()) {
									this.userDetails = res.body?.data?.user_details ?? this.userDetails;
									if (this.userDetails) {
										this.userDetails.self = res.body?.data?.self
										this.authService.setUpdatedUser({
											name: this.userDetails.name,
											email: this.userDetails.email,
											uuid: this.userDetails.uuid,
											profile_url: this.userDetails.profile_url,
											contact_no: this.userDetails.contact_no,
											is_admin: res.body?.data?.is_admin,
											admin: res.body?.data?.admin,
											deleted: res.body?.data?.deleted,
										})
									}
									this.cdr.markForCheck();
									console.log("Profile updated successfully!");
								} else {
									console.error("Error updating profile:", res.statusText);
								}
							});
				}
			});
		}
	}

	ngOnDestroy() {
		this.destroy$.next(null);
		this.destroy$.complete();
	}
}
