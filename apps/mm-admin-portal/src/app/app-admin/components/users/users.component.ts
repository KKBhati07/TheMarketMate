import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { LoggingService, NotificationService, User, UserDetailsDto } from "mm-shared";
import { DeviceDetectorService } from "mm-shared";
import { Subject, takeUntil } from "rxjs";
import { AdminService } from '../../../services/admin.service';

@Component({
	selector: 'mm-admin-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
	users: UserDetailsDto[] = [];
	isMobile = false;
	isLoading = false;
	destroy$ = new Subject();
	currentPage = 0;
	hasMore = true;
	private intersectionObserver?: IntersectionObserver;

	constructor(private adminService: AdminService,
							private cdr: ChangeDetectorRef,
							private deviceDetectorService: DeviceDetectorService,
							private notificationService: NotificationService,
							private logger: LoggingService,
	) {
	}

	ngOnInit() {
		this.getAllUsers();
		this.setIsMobile();
	}

	ngAfterViewInit() {
		this.setupIntersectionObserver();
	}


	getAllUsers(page?: number, append: boolean = false) {
		if (this.isLoading) return;

		this.isLoading = true;
		const pageToLoad = page ?? this.currentPage;

		this.adminService.getAllUsers(pageToLoad)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.isLoading = false;
					if (res.isSuccessful()) {
						const response = res.body?.data;
						const newItems = response?.items ?? [];

						if (append) {
							this.users.push(...newItems);
						} else {
							this.users = newItems;
							this.currentPage = 0;
							setTimeout(() => this.observeSentinel(), 0);
						}

						// Check if there are more pages
						if (response?.total_pages !== undefined) {
							this.hasMore = (response.current_page ?? pageToLoad) < (response.total_pages - 1);
						} else {
							// Assume more pages
							this.hasMore = newItems.length > 0;
						}

						if (append) {
							this.currentPage = (response?.current_page ?? pageToLoad) + 1;
						} else {
							this.currentPage = (response?.current_page ?? 0) + 1;
						}

						this.cdr.markForCheck();
					} else {
						this.logger.warn('Failed to load users', {
							page: pageToLoad,
							status: res.status,
							statusText: res.statusText
						});
						this.cdr.markForCheck();
						this.notificationService.error({
							message: 'Failed to load users. Please refresh and try again.',
						});
					}
				});
	}

	setupIntersectionObserver() {
		if (typeof IntersectionObserver === 'undefined') {
			return;
		}

		this.intersectionObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach(entry => {
						if (entry.isIntersecting && this.hasMore && !this.isLoading && this.users.length > 0) {
							this.loadNextPage();
						}
					});
				},
				{
					rootMargin: '200px',
					threshold: 0.1
				}
		);

		// Observe the sentinel
		setTimeout(() => this.observeSentinel(), 0);
	}

	observeSentinel() {
		this.intersectionObserver?.disconnect();
		const sentinel = document.getElementById('users-sentinel');
		if (sentinel && this.intersectionObserver) {
			this.intersectionObserver.observe(sentinel);
		}
	}

	loadNextPage() {
		if (!this.hasMore || this.isLoading) return;
		this.getAllUsers(this.currentPage, true);
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
		if (this.intersectionObserver) {
			this.intersectionObserver.disconnect();
		}
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
						this.notificationService.success({
							message: `User deleted`,
						});

					} else {
						this.logger.warn('User delete failed', { uuid, status: res.status, statusText: res.statusText });
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
						this.logger.warn('User restore failed', { uuid, status: res.status, statusText: res.statusText });
						this.notificationService.error({
							message: `User restore failed`,
						});
					}
				})
	}
}
