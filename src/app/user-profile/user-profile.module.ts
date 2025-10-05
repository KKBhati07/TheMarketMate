import { NgModule } from "@angular/core";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { AppUtilModule } from "../app-util/module/app-util.module";
import { ProfileDetailsComponent } from "./components/profile-details/profile-details.component";
import { UserProfileEditComponent } from "./components/user-profile-edit/user-profile-edit.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MyUserProfileBarComponent } from './components/user-profile-bar/user-profile-bar.component';
import { AppSharedModule } from '../shared/app-shared.module';

@NgModule({
	declarations: [
		UserProfileComponent,
		ProfileDetailsComponent,
		UserProfileEditComponent,
		MyUserProfileBarComponent
	],
	imports: [CommonModule,
		MatIconModule,
		AppUtilModule,
		ReactiveFormsModule,
		MatDialogModule,
		AppSharedModule
	]
})
export class UserProfileModule {
}
