import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { LandingComponent } from "./components/landing/landing.component";
import { UsersComponent } from "./components/users/users.component";
import { ListingComponent } from "./components/listings/listing.component";
import { MatIcon } from "@angular/material/icon";
import { SharedModule } from "mm-shared";
import { AdminUserListComponent } from "./components/user-list/user-list.component";
import { AppListingCardModule } from 'mm-shared';
import { UserListSkeletonComponent } from './components/user-list-skeleton/user-list-skeleton.component';

@NgModule({
	declarations: [
		LandingComponent,
		UsersComponent,
		ListingComponent,
		AdminUserListComponent,
		UserListSkeletonComponent
	],
	imports: [
		CommonModule,
		RouterOutlet,
		MatIcon,
		SharedModule,
		AppListingCardModule,
	]
})
export class AppAdminModule {
}
