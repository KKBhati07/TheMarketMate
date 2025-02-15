import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {ProfileDetails} from "../../../models/user.model";

@Component({
  selector: 'mm-profile-detail',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileDetailsComponent implements OnInit {
  @Input() userDetails: ProfileDetails | null = null;
  hideComponent = false;
  idBottomSheet = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  onEditProfileClick() {}
}
