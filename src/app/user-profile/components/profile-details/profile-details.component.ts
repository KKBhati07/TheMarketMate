import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ProfileDetails} from "../../../models/user.model";
import {MatDialog} from "@angular/material/dialog";
import {UserProfileEditComponent} from "../user-profile-edit/user-profile-edit.component";
import {Subject, takeUntil} from "rxjs";
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'mm-profile-detail',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  @Input() userDetails: ProfileDetails | null = null;
  @Input() isMobile: boolean = false;
  hideComponent = false;
  idBottomSheet = false;
  destroy$: Subject<any> = new Subject();

  constructor(private cdr: ChangeDetectorRef,
              private userService: UserService,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit() {}

  onEditProfileClick() {
    if (this.userDetails) {
      const dialogRef = this.dialog.open(UserProfileEditComponent, {
        backdropClass: 'profile-edit-from-backdrop',
        panelClass: this.isMobile?'profile-edit-from-container-mobile':'profile-edit-from-container',
        hasBackdrop: true,
        data: {
          userDetails: this.userDetails,
          isMobile: this.isMobile
        }
      });
      dialogRef.afterClosed().subscribe((data: FormData | null) => {
        if (data) {
          this.userService.updateUser(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              if (res.isSuccessful()) {
                this.userDetails = res.body?.data?.user_details ?? this.userDetails;
                if (this.userDetails) {
                  this.userDetails.self = res.body?.data?.self
                  this.authService.setUpdatedUser({
                    name: this.userDetails.name,
                    email: this.userDetails.email,
                    uuid: this.userDetails.uuid,
                    profileUrl: this.userDetails.profileUrl,
                    contactNo: this.userDetails.contactNo,
                    is_admin: res.body?.data?.is_admin,
                    admin: res.body?.data?.admin,
                    deleted: res.body?.data?.deleted,
                  })
                }
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
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
