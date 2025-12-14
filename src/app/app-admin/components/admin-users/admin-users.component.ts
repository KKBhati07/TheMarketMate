import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../../shared/models/user.model";
import { DeviceDetectorService } from "../../../app-util/services/device-detector.service";
import { Subject, takeUntil } from "rxjs";
import { AdminService } from '../../../shared/services/admin.service';

@Component({
	selector: 'mm-admin-users',
	templateUrl: './admin-users.component.html',
	styleUrls: ['./admin-users.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent implements OnInit, OnDestroy {
	users: User[] = [];
	isMobile = false;
	isLoading = true;
	destroy$ = new Subject();

	constructor(private adminService: AdminService,
							private cdr: ChangeDetectorRef,
							private deviceDetectorService: DeviceDetectorService
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
						// TODO :: implement notifications
					} else {
						console.warn('Unable to delete user')
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
						console.log(`User with id ${ uuid } restored!`);
						// TODO :: implement notifications
					} else {
						console.warn('Unable to restore user')
					}
				})
	}
}
