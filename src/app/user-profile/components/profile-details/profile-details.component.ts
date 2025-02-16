import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ProfileDetails} from "../../../models/user.model";
import {MatDialog} from "@angular/material/dialog";
import {UserProfileEditComponent} from "../user-profile-edit/user-profile-edit.component";
import {Subject, takeUntil} from "rxjs";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'mm-profile-detail',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  @Input() userDetails: ProfileDetails | null = null;
  hideComponent = false;
  idBottomSheet = false;
  destroy$: Subject<any> = new Subject();

  constructor(private cdr: ChangeDetectorRef,
              private userService: UserService,
              private dialog: MatDialog) {
  }

  ngOnInit() {}

  onEditProfileClick() {
    if (this.userDetails) {
      const dialogRef = this.dialog.open(UserProfileEditComponent, {
        backdropClass: 'profile-edit-from-backdrop',
        panelClass: 'profile-edit-from-container',
        hasBackdrop: true,
        data: {userDetails: this.userDetails}
      });
      dialogRef.afterClosed().subscribe((data: FormData | null) => {
        if (data) {
          this.userService.updateUser(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              if (res.isSuccessful()) {
                console.log("Profile updated successfully!");
              } else {
                console.error("Error updating profile:", res.statusText);
              }
            });
        }
      })
    }
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
