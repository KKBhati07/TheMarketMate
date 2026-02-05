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
import { handleKeyboardActivation, SHARED_UI_DEPS, AppButtonComponent, BottomSheetPillComponent, BackForwardIconComponent } from '@marketmate/shared';
import {
	NotificationService,
	UpdateUserPayload,
	UpdateUserResponse,
	UserDetailsDto, UserDetailsResponse
} from "@marketmate/shared";
import { LoggingService } from "@marketmate/shared";
import { MatDialog } from "@angular/material/dialog";
import { UserProfileEditComponent } from "@marketmate/shared";
import { catchError, map, of, Subject, switchMap, takeUntil, tap, throwError, timer } from "rxjs";
import { UserService } from "../../../services/user.service";
import { AuthService } from "@marketmate/shared";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ProfileDetailsBottomSheetData } from '../../../types/common.type';
import { ImageViewerComponent } from '@marketmate/shared';
import { StorageService, Directory } from '@marketmate/shared';
import { CONSTANTS } from '../../../app.constants';
import { HttpResponse } from '@angular/common/http';
import { ApiHttpResponse, ApiResponse } from '@marketmate/shared';

@Component({
	selector: 'mm-profile-detail',
	templateUrl: './profile-details.component.html',
	styleUrls: ['./profile-details.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, AppButtonComponent, BottomSheetPillComponent, BackForwardIconComponent]
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

	@Input() isExpanded = false;
	@Input() userDetails: UserDetailsDto | null = null;
	@Input() self: boolean = false;
	@Input() isMobile: boolean = false;
	isBottomSheet = false;
	destroy$: Subject<void> = new Subject<void>();
	renderIcon = false
	@Output() expandComponent = new EventEmitter<boolean>();
	isUpdatingProfile = false;

	constructor(private cdr: ChangeDetectorRef,
							private userService: UserService,
							private authService: AuthService,
							private storageService: StorageService,
							@Inject(MAT_BOTTOM_SHEET_DATA)
							public data: ProfileDetailsBottomSheetData,
							private bsr: MatBottomSheetRef,
							private notificationService: NotificationService,
							private logger: LoggingService,
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

	onExpandKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.expandComponent.emit(!this.isExpanded), event);
	}

	onProfilePicKeydown(event: KeyboardEvent) {
		if (this.userDetails?.profile_url && !this.renderIcon) {
			handleKeyboardActivation(() => this.onProfilePicClick(), event);
		}
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

			dialogRef.afterClosed()
					.pipe(takeUntil(this.destroy$))
					.subscribe((updatedPayload: UpdateUserPayload | null) => {
				if (!updatedPayload) return;
				this.isUpdatingProfile = true;
				this.cdr.markForCheck();
				const { profile_url, profileImage, ...remainingPayload } = updatedPayload
				let objectKey: string;

				if (Object.keys(remainingPayload).length > 1) {
					this.userService.updateUser(remainingPayload)
							.pipe(takeUntil(this.destroy$)).subscribe(res => {
						if (res.isSuccessful()) {
							this.setUpdatedUserState(res)
							if (!profileImage) {
								this.isUpdatingProfile = false;
								this.notificationService.success({
									message: 'User profile updated',
								});
								this.cdr.markForCheck();
							}
						} else {
							if (!profileImage) {
								this.isUpdatingProfile = false;
								this.notificationService.error({
									message: 'Error updating user',
								});
								this.cdr.markForCheck();
							}
						}
					});
				}

				if (!profileImage) return;

				this.storageService.getPresignPutUrl({
					files: [{ file_name: profileImage.name, content_type: profileImage.type || CONSTANTS.CONTENT_TYPE.DEFAULT }],
					directory: Directory.PROFILE
				}).pipe(
						takeUntil(this.destroy$),
						switchMap(res => {
							if (!res.isSuccessful()) return throwError(() => new Error('Presign API failed'));
							const data = res.body?.data;
							if (!data) return throwError(() => new Error('No data in presign response'));
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
							this.logger.warn('Presign upload failed after retries, verify existence then fallback if needed', { err });
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
												switchMap((fbResp: ApiHttpResponse<void>) => {
													if (!fbResp.isSuccessful()) {
														return throwError(() => new Error('Fallback upload failed'));
													}
													return of({ success: true, objectKey: null, fallbackUpdatedServer: true });
												})
										);
									}),
									catchError(innerErr => {
										this.logger.warn('Exists check failed; attempting fallback upload anyway', { innerErr });
										const fd = new FormData();
										fd.append('uuid', updatedPayload.uuid);
										fd.append('file', profileImage);
										return this.userService.uploadImageFallback(fd).pipe(
												switchMap((fbResp: ApiHttpResponse<void>) => {
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

							if (!result.objectKey) return of(null);
							const payload: UpdateUserPayload = {
								uuid: updatedPayload.uuid,
								profile_url: result.objectKey
							};
							return this.userService.updateUser(payload).pipe(
									tap(res => {
										if (res.isSuccessful()) {
											this.setUpdatedUserState(res);
											this.cdr.markForCheck();
										} else {
											this.logger.error('Error updating profile', res.statusText, { uuid: updatedPayload.uuid });
										}
									}),
									map(resp => ({ updatedByFallback: false, resp }))
							);
						}),

						catchError(finalErr => {
							this.logger.error('All upload attempts failed', finalErr, { uuid: updatedPayload.uuid });
							// TODO: Show user notification with a Retry button (In update pipeline)
							this.isUpdatingProfile = false;
							this.notificationService.error({
								message: `Error updating profile`,
							});
							this.cdr.markForCheck();
							return of(null);
						}),
						takeUntil(this.destroy$)
				).subscribe(finalResult => {
					this.isUpdatingProfile = false;
					if (!finalResult) {
						this.notificationService.error({
							message: 'Error updating profile',
						});
						this.cdr.markForCheck();
						return;
					}

					if (finalResult.updatedByFallback) {
						this.notificationService.success({
							message: 'User profile updated',
						});
					}
					this.cdr.markForCheck();
				});
			});
		}
	}

	setUpdatedUserState(res: HttpResponse<ApiResponse<UpdateUserResponse | UserDetailsResponse>>) {
		this.userDetails = res.body?.data?.user_details ?? this.userDetails;
		if (this.userDetails) {
			this.self = res.body?.data?.self ?? false;
			this.authService.setUpdatedUser({
				name: this.userDetails.name,
				email: this.userDetails.email,
				uuid: this.userDetails.uuid,
				profile_url: (this.userDetails.profile_url ?? ''),
				contact_no: this.userDetails.contact_no,
				is_admin: this.userDetails.is_admin,
				admin: this.userDetails.is_admin,
			})
		}
		this.cdr.markForCheck();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
