import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
	AppConfirmDeleteDialogComponent, UserDetailsDto, SHARED_UI_DEPS
} from '@marketmate/shared';
import { LoggingService } from '@marketmate/shared';
import { NotificationService } from '@marketmate/shared';
import { Subject, takeUntil } from "rxjs";
import {
	UserProfileEditComponent
} from '@marketmate/shared';
import { AdminService } from '../../../services/admin.service';
import { fadeSlideIn } from '@marketmate/shared';
import { handleKeyboardActivation } from '@marketmate/shared';

@Component({
	selector: 'mm-admin-user-list',
	standalone: true,
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeSlideIn],
	imports: [...SHARED_UI_DEPS]
})
export class AdminUserListComponent implements OnDestroy {
	@Input() user: UserDetailsDto | null = null;
	@Input() isMobile: boolean = false;
	@Output() deleteOrRestoreUser: EventEmitter<{ action: string, uuid: string }>
			= new EventEmitter<{ action: string, uuid: string }>()
	@Output() getUpdatedList: EventEmitter<boolean>
			= new EventEmitter<boolean>()
	destroy$: Subject<void> = new Subject<void>();
	renderIcon = false;

	constructor(
			private dialog: MatDialog,
			private cdr: ChangeDetectorRef,
			private adminService: AdminService,
			private logger: LoggingService,
			private notificationService: NotificationService,
	) {
	}

	onDeleteClick(): void {
		if (!this.user) return;
		const dialogRef = this.dialog.open(AppConfirmDeleteDialogComponent, {
			width: '400px',
			hasBackdrop: true,
			panelClass: 'delete-dialog-container',
			backdropClass: 'delete-dialog-backdrop',
			data: {
				name: this.user.name,
				isMobile: this.isMobile
			}
		});

		dialogRef.afterClosed()
				.pipe(takeUntil(this.destroy$))
				.subscribe(confirmDelete => {
					if (confirmDelete && this.user?.uuid) {
						this.deleteOrRestoreUser.emit({ action: 'DELETE', uuid: this.user.uuid });
					}
				});
	}

	onEditProfileKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onEditProfileClick(), event);
	}

	onEditProfileClick() {
		if (this.user) {
			const dialogRef =
					this.dialog.open(UserProfileEditComponent, {
						backdropClass: 'profile-edit-from-backdrop',
						panelClass: this.isMobile ?
								'profile-edit-from-container-mobile'
								: 'profile-edit-from-container',
						hasBackdrop: true,
						data: {
							userDetails: this.user,
							isMobile: this.isMobile
						}
					});
			dialogRef.afterClosed()
					.pipe(takeUntil(this.destroy$))
					.subscribe((data: FormData | null) => {
				if (data) {
					this.adminService.updateUser(data)
							.pipe(takeUntil(this.destroy$))
							.subscribe(res => {
								if (res.isSuccessful()) {
									this.getUpdatedList.emit(true);
									this.cdr.markForCheck();
								} else {
									this.logger.error('Error updating profile', res.statusText, { uuid: this.user?.uuid });
									this.notificationService.error({
										message: 'Error updating profile',
									});
								}
							});
				}
			});
		}
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onRestoreClick() {
		if (!this.user) return;
		this.deleteOrRestoreUser.emit({ action: 'RESTORE', uuid: this.user.uuid });
	}
}
