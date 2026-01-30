import { Routes } from '@angular/router';
import { AppUrls } from "./app.urls";
import { AppUrls as SharedUrls } from "mm-shared";
import { AppRootComponent } from "./app-root/components/app-root.component";
import { HomeComponent } from "./app-root/components/home-component/home.component";
import { FourOFourComponent } from "mm-shared";

export const routes: Routes = [
	{ path: AppUrls.ROOT, component: AppRootComponent },
	{ path: AppUrls.HOME, component: HomeComponent },
	{
		path: SharedUrls.AUTH.BASE,
		loadChildren: () => import('./app-auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: AppUrls.USER.BASE,
		loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)
	},
	{ path: AppUrls.FOUROFOUR, component: FourOFourComponent },
	{ path: '**', redirectTo: AppUrls.FOUROFOUR, pathMatch: "full" }

];
