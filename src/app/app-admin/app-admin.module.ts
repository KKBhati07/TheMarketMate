import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, RouterOutlet} from "@angular/router";
import {AdminLandingComponent} from "./components/admin-landing/admin-landing.component";
import {AdminUsersComponent} from "./components/admin-users/admin-users.component";
import {AdminListingComponent} from "./components/admin-listings/admin-listing.component";
import {MatIcon} from "@angular/material/icon";
import {AppLoaderModule} from "../app-loader/app-loader.module";
import {AdminUserListComponent} from "./components/user-list/user-list.component";

@NgModule({
  declarations: [
    AdminLandingComponent,
    AdminUsersComponent,
    AdminListingComponent,
    AdminUserListComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    // RouterModule.forChild([]),
    MatIcon,
    AppLoaderModule,
    // ✅ Use forChild([]) in feature modules
  ]
})
export class AppAdminModule {
}
