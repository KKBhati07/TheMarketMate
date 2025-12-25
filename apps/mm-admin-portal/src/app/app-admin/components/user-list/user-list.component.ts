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
	AppConfirmDeleteDialogComponent
} from 'mm-shared';
import { User } from 'mm-shared';
import { Subject, takeUntil } from "rxjs";
import {
	UserProfileEditComponent
} from 'mm-shared';
import { AdminService } from '../../../services/admin.service';
import { fadeSlideIn } from 'mm-shared';

@Component({
	selector: 'mm-admin-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeSlideIn],
})
export class AdminUserListComponent implements OnDestroy {
	@Input() user: User | null = null;
	@Input() isMobile: boolean = false;
	@Output() deleteOrRestoreUser: EventEmitter<{ action: string, uuid: string }>
			= new EventEmitter<{ action: string, uuid: string }>()
	@Output() getUpdatedList: EventEmitter<boolean>
			= new EventEmitter<boolean>()
	destroy$ = new Subject();
	renderIcon = false;

	constructor(
			private dialog: MatDialog,
			private cdr: ChangeDetectorRef,
			private adminService: AdminService,
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
			dialogRef.afterClosed().subscribe((data: FormData | null) => {
				if (data) {
					this.adminService.updateUser(data)
							.pipe(takeUntil(this.destroy$))
							.subscribe(res => {
								if (res.isSuccessful()) {
									this.getUpdatedList.emit(true);
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
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	onRestoreClick() {
		if (!this.user) return;
		this.deleteOrRestoreUser.emit({ action: 'RESTORE', uuid: this.user.uuid });
	}

	onImageNotFound() {
		// this.
	}
}
