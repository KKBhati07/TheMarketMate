import { Routes } from '@angular/router';
import { FormContainerComponent } from "mm-shared";
import { AppUrls } from "./app.urls";
import { LoginSignupGuard } from "mm-shared";
import { AppRootComponent } from "./app-root/components/app-root.component";
import { HomeComponent } from "./app-root/components/home-component/home.component";
import { UserProfileComponent } from "./user-profile/components/user-profile/user-profile.component";
import { FourOFourComponent } from "mm-shared";

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
	// {
	// 	path: AppUrls.ADMIN.LANDING,
	// 	loadChildren: () =>
	// 			import('./app-admin/app-admin.module').then(m => m.AppAdminModule),
	// },
	{ path: AppUrls.FOUROFOUR, component: FourOFourComponent },
	{ path: '**', redirectTo: AppUrls.FOUROFOUR, pathMatch: "full" }

];
