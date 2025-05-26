import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DeviceDetectorService} from "../../../app-util/services/device-detector.service";
import {UserService} from "../../../services/user.service";
import {ProfileDetails} from "../../../models/user.model";
import {Subject, takeUntil} from "rxjs";
import {AppUrls} from "../../../app.urls";

@Component({
  selector: "mm-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
  renderComponent = false;
  isMobile = false;
  userDetails: ProfileDetails | null = null;
  destroy$ = new Subject();

  constructor(
    private router: Router,
    private deviceDetector: DeviceDetectorService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private activatedRoute:ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.setIsMobile();
    this.getUserDetails();
  }

  setIsMobile() {
    this.deviceDetector.isMobile().subscribe(isMobile => {
      this.isMobile = isMobile;
      this.cdr.markForCheck();
    })
  }

  getUserDetails() {
    const uuid = this.activatedRoute.snapshot.params['uuid'];
    this.userService.getDetails(uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.isSuccessful()) {
          this.userDetails = res.body?.data?.user_details;
          if (this.userDetails) this.userDetails.self = res.body?.data?.self
          this.renderComponent = true;
          this.cdr.markForCheck();
        }else{
          this.router.navigate([AppUrls.FOUROFOUR]).then(r=>null);
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
