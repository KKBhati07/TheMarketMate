import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { NotificationService, User } from "mm-shared";
import { DeviceDetectorService } from "mm-shared";
import { Subject, takeUntil } from "rxjs";
import { AdminService } from '../../../services/admin.service';

@Component({
	selector: 'mm-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy {
	users: User[] = [];
	isMobile = false;
	isLoading = true;
	destroy$ = new Subject();

	constructor(private adminService: AdminService,
							private cdr: ChangeDetectorRef,
							private deviceDetectorService: DeviceDetectorService,
							private notificationService: NotificationService,
	) {
	}

	ngOnInit() {
		this.getAllUsers();
		this.setIsMobile();
	}


	getAllUsers() {
		this.adminService.getAllUsers()
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.users = res.body?.data?.items ?? [];
						this.isLoading = false;
						this.cdr.markForCheck();
					}
				});
	}

	setIsMobile() {
		this.deviceDetectorService.isMobile()
				.pipe(takeUntil(this.destroy$))
				.subscribe(isMobile => {
					this.isMobile = isMobile;
					this.cdr.markForCheck();
				});
	}

	ngOnDestroy() {
		this.destroy$.next(null);
		this.destroy$.complete();
	}

	onDeleteOrRestoreUser(event: { action: string; uuid: string }) {
		switch (event.action) {
			case 'DELETE':
				this.deleteUser(event.uuid);
				break;
			case 'RESTORE':
				this.restoreUser(event.uuid);
		}
	}

	deleteUser(uuid: string) {
		this.isLoading = true;
		this.adminService.deleteUser(uuid)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.users = this.users.map(user =>
								user.uuid === uuid
										? { ...user, deleted: true }
										: user
						);
						this.isLoading = true;
						this.cdr.markForCheck();
						console.log(`User with id ${ uuid } deleted!`);
						this.notificationService.success({
							message: `User deleted`,
						});

					} else {
						this.notificationService.error({
							message: `User delete failed`,
						});
					}
				})
	}

	restoreUser(uuid: string) {
		this.isLoading = true;
		this.adminService.restoreUser(uuid)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.users = this.users.map(user =>
								user.uuid === uuid
										? { ...user, deleted: false }
										: user
						);
						this.isLoading = false;
						this.cdr.markForCheck();
						this.notificationService.success({
							message: `User restored`,
						});
					} else {
						this.notificationService.error({
							message: `User restore failed`,
						});
					}
				})
	}
}
