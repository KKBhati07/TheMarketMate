import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {User} from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {DeviceDetectorService} from "../../../app-util/services/device-detector.service";
import {Subject, takeUntil} from "rxjs";

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

  constructor(private userService: UserService,
              private cdr: ChangeDetectorRef,
              private deviceDetectorService: DeviceDetectorService
  ) {
  }

  ngOnInit() {
    this.getAllUsers();
    this.setIsMobile();
  }


  getAllUsers() {
    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.isSuccessful()) {
          this.users = res.body?.data?.users ?? [];
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

  onDeleteOrRestroreUser(event: { action: string; uuid: string }) {
    switch (event.action) {
      case 'DELETE':
        this.deleteUser(event.uuid);
        break;
      case 'RESTORE':
        this.restoreUser(event.uuid);
    }
  }

  deleteUser(uuid: string) {
    this.userService.deleteUserByAdmin(uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.isSuccessful()) {
          this.isLoading = true;
          this.cdr.markForCheck();
          this.getAllUsers();
          console.log(`User with id ${uuid} deleted!`);
          // TODO :: implement notifications
        } else {
          console.warn('Unable to delete user')
        }
      })
  }

  restoreUser(uuid: string) {
    this.userService.restoreUser(uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.isSuccessful()) {
          this.isLoading = true;
          this.cdr.markForCheck();
          this.getAllUsers();
          console.log(`User with id ${uuid} restored!`);
          // TODO :: implement notifications
        } else {
          console.warn('Unable to restore user')
        }
      })
  }
}
