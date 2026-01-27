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
import { NotificationService, ProfileDetails, UpdateUserPayload, User } from "mm-shared";
import { MatDialog } from "@angular/material/dialog";
import { UserProfileEditComponent } from "mm-shared";
import { catchError, map, of, Subject, switchMap, takeUntil, tap, throwError, timer } from "rxjs";
import { UserService } from "../../../services/user.service";
import { AuthService } from "mm-shared";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ProfileDetailsBottomSheetData } from '../../../types/common.type';
import { ImageViewerComponent } from 'mm-shared';
import { StorageService } from 'mm-shared';
import { CONSTANTS } from '../../../app.constants';
import { HttpResponse } from '@angular/common/http';
import { ApiResponse } from 'mm-shared';
import { Router } from '@angular/router';
import { AppUrls } from '../../../app.urls';

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
							private storageService: StorageService,
							private router: Router,
							@Inject(MAT_BOTTOM_SHEET_DATA)
							public data: ProfileDetailsBottomSheetData,
							private bsr: MatBottomSheetRef,
							private notificationService: NotificationService,
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

			dialogRef.afterClosed().subscribe((updatedPayload: UpdateUserPayload | null) => {
				if (!updatedPayload) return;
				const { profile_url, profileImage, ...remainingPayload } = updatedPayload
				let objectKey: string;

				if (Object.keys(remainingPayload).length > 1) {
					this.userService.updateUser(remainingPayload)
							.pipe(takeUntil(this.destroy$)).subscribe(res => {
						if (res.isSuccessful()) {
							this.setUpdatedUserState(res)
							if (!profileImage) {
								this.notificationService.success({
									message: 'User profile updated',
								});
							}
						} else {
							if (!profileImage) {
								this.notificationService.error({
									message: 'Error updating user',
								});
							}
						}
					});
				}

				if (!profileImage) return;

				this.storageService.getPresignPutUrl({
					files: [{ file_name: profileImage.name, content_type: profileImage.type || CONSTANTS.CONTENT_TYPE.DEFAULT }],
					directory: 'PROFILE'
				}).pipe(
						takeUntil(this.destroy$),
						switchMap(res => {
							if (!res.isSuccessful()) return throwError(() => new Error('Presign API failed'));
							const data = res.body?.data!;
							const presigns = data.presigns ?? [];
							if (!presigns.length) return throwError(() => new Error('No presign entries returned'));
							const presigned = presigns[0];
							objectKey = presigned.object_key;

							return this.storageService.uploadFileToS3(presigned.url, profileImage, presigned.headers)
									.pipe(
											map(() => ({ success: true, objectKey }))
									);
						}),

						catchError(err => {
							console.warn('Presign upload failed after retries, will verify existence then fallback if needed:', err);
							return this.storageService.checkObjectExists(objectKey).pipe(
									switchMap(existsResp => {
										const exists = existsResp?.body?.data.exists ?? false;
										if (exists) {
											return of({ success: true, objectKey });
										}

										const fd = new FormData();
										fd.append('uuid', updatedPayload.uuid);
										fd.append('file', profileImage);

										return this.userService.uploadImageFallback(fd).pipe(
												switchMap((fbResp: any) => {
													if (!fbResp.isSuccessful()) {
														return throwError(() => new Error('Fallback upload failed'));
													}
													return of({ success: true, objectKey: null, fallbackUpdatedServer: true });
												})
										);
									}),
									catchError(innerErr => {
										console.warn('Exists check failed or errored; attempting fallback upload anyway', innerErr);
										const fd = new FormData();
										fd.append('uuid', updatedPayload.uuid);
										fd.append('file', profileImage);
										return this.userService.uploadImageFallback(fd).pipe(
												switchMap((fbResp: any) => {
													if (!fbResp.isSuccessful()) {
														return throwError(() => new Error('Fallback upload failed'));
													}
													return of({ success: true, objectKey: null, fallbackUpdatedServer: true });
												})
										);
									})
							);
						}),
						switchMap((result: { success: boolean; objectKey?: string | null; fallbackUpdatedServer?: boolean }) => {
							if (!result || !result.success) return of(null);

							if (result.fallbackUpdatedServer) {
								return this.userService.getDetails(updatedPayload.uuid).pipe(
										tap((res) => {
											this.setUpdatedUserState(res);
										}),
										map(() => ({ updatedByFallback: true }))
								);
							}

							const payload: UpdateUserPayload = {
								uuid: (updatedPayload as any).uuid,
								profile_url: result.objectKey!
							};
							return this.userService.updateUser(payload).pipe(
									tap(res => {
										if (res.isSuccessful()) {
											this.setUpdatedUserState(res);
											this.cdr.markForCheck();
											console.log("Profile updated successfully!");
										} else {
											console.error("Error updating profile:", res.statusText);
										}
									}),
									map(resp => ({ updatedByFallback: false, resp }))
							);
						}),

						catchError(finalErr => {
							console.error('All upload attempts failed:', finalErr);
							// TODO: Show user notification with a Retry button (In update pipeline)
							this.notificationService.success({
								message: `Error updating profile`,
							});

							return of(null);
						})
				).subscribe(finalResult => {
					if (!finalResult) {
						this.notificationService.error({
							message: 'Error updating profile',
						});
						return;
					}

					if (finalResult.updatedByFallback) {
						this.notificationService.success({
							message: 'User profile updated',
						});
					}
				});
			});
		}
	}

	setUpdatedUserState(res: HttpResponse<ApiResponse<any>>) {
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
	}


	openChat() {
		this.router.navigate([AppUrls.CHAT], {
			queryParams: { user: this.userDetails?.uuid }
		}).then(res=>null);
	}


	ngOnDestroy() {
		this.destroy$.next(null);
		this.destroy$.complete();
	}
}
