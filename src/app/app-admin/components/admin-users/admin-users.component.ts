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
}
