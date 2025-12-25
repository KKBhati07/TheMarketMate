import { NgModule } from "@angular/core";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { AppUtilModule } from "../app-util/module/app-util.module";
import { ProfileDetailsComponent } from "./components/profile-details/profile-details.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { UserProfileBarComponent } from './components/user-profile-bar/user-profile-bar.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { AppListingCardModule, SharedModule } from 'mm-shared';

@NgModule({
	declarations: [
		UserProfileComponent,
		ProfileDetailsComponent,
		UserProfileBarComponent
	],
	imports: [CommonModule,
		MatIconModule,
		AppUtilModule,
		ReactiveFormsModule,
		MatDialogModule,
		AppListingCardModule,
		MatTabGroup,
		MatTab, SharedModule, AppListingCardModule
	]
})
export class UserProfileModule {
}
