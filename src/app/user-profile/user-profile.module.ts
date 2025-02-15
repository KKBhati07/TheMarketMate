import {NgModule} from "@angular/core";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {AppUtilModule} from "../app-util/module/app-util.module";
import {ProfileDetailsComponent} from "./components/profile-details/profile-details.component";

@NgModule({
  declarations: [UserProfileComponent, ProfileDetailsComponent],
  imports: [CommonModule, MatIconModule, AppUtilModule]
})
export class UserProfileModule {
}
