import { Routes } from '@angular/router';
import { FormContainerComponent } from "./forms-container/form-container/form-container.component";
import { AppUrls } from "./app.urls";
import { LoginSignupGuard } from "./app-util/guards/login-signup.guard";
import { AppRootComponent } from "./app-root/components/app-root.component";
import { HomeComponent } from "./app-root/components/home-component/home.component";
import { UserProfileComponent } from "./user-profile/components/user-profile/user-profile.component";
import { AdminLandingComponent } from "./app-admin/components/admin-landing/admin-landing.component";
import { AdminUsersComponent } from "./app-admin/components/admin-users/admin-users.component";
import { AdminListingComponent } from "./app-admin/components/admin-listings/admin-listing.component";
import { FourOFourComponent } from "./shared/components/four-o-four/four-o-four.component";
import { AdminGuard } from './app-util/guards/admin.guard';

export const routes: Routes = [
	{ path: AppUrls.ROOT, component: AppRootComponent },
	{ path: AppUrls.HOME, component: HomeComponent },
	{
		path: AppUrls.AUTH.LOGIN,
		component: FormContainerComponent,
		data: { type: 'login' },
		canActivate: [LoginSignupGuard]
	},
	{
		path: AppUrls.AUTH.SIGNUP,
		component: FormContainerComponent,
		data: { type: 'signup' },
		canActivate: [LoginSignupGuard]
	},
	{
		path: AppUrls.USER.USER_PROFILE(),
		component: UserProfileComponent
	},
	{
		path: AppUrls.ADMIN.LANDING,
		component: AdminLandingComponent,
		canActivate: [AdminGuard],
		children: [
			{ path: '', redirectTo: AppUrls.ADMIN.USERS, pathMatch: 'full' },
			{ path: 'users', component: AdminUsersComponent },
			{ path: 'listings', component: AdminListingComponent }
		]
	},
	{ path: AppUrls.FOUROFOUR, component: FourOFourComponent },
	{ path: '**', redirectTo: AppUrls.FOUROFOUR, pathMatch: "full" }

];
