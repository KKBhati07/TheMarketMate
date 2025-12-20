import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { LandingComponent } from "./components/landing/landing.component";
import { UsersComponent } from "./components/users/users.component";
import { ListingComponent } from "./components/listings/listing.component";
import { MatIcon } from "@angular/material/icon";
import { SharedModule } from "mm-shared";
import { AdminUserListComponent } from "./components/user-list/user-list.component";
// import { AppUtilModule } from "../app-util/module/app-util.module";
import { AppListingCardModule } from 'mm-shared';
// import { adminRoutes } from '../app-admin.routes';

@NgModule({
	declarations: [
		LandingComponent,
		UsersComponent,
		ListingComponent,
		AdminUserListComponent
	],
	imports: [
		CommonModule,
		RouterOutlet,
		// RouterModule.forChild(adminRoutes),
		MatIcon,
		SharedModule,
		// AppUtilModule,
		AppListingCardModule,
	]
})
export class AppAdminModule {
}
