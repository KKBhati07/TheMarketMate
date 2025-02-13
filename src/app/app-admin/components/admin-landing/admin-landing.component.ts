import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {URLS} from "../../../urls";
import {DeviceDetectorService} from "../../../app-util/services/device-detector.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: "mm-admin",
  templateUrl: "./admin-landing.component.html",
  styleUrls: ["./admin-landing.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AdminLandingComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  isUsersSelected = true;
  destroy$ = new Subject();

  constructor(private router: Router,
              private deviceDetectorService: DeviceDetectorService,
              private cdr: ChangeDetectorRef
  ) {
  }


  ngOnInit() {
    this.navigateToUserList();
    this.setIsMobile();
  }

  navigateToUserList() {
    this.router.navigate([URLS.ADMIN.USERS]).then(r => null);
  }

  setIsMobile() {
    this.deviceDetectorService.isMobile()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMobile => {
        this.isMobile = isMobile;
        this.cdr.markForCheck();
        console.warn(this.isMobile)
      });
  }

  onNavItemClick(navToUser: boolean) {
    if (navToUser) {
      this.router.navigate([URLS.ADMIN.USERS]).then(r => null);
      this.isUsersSelected = true;
      this.cdr.markForCheck();
      return
    }
    this.isUsersSelected = false;
    this.router.navigate([URLS.ADMIN.LISTINGS]).then(r => null);
    this.cdr.markForCheck();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
