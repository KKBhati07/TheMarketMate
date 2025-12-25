import { Routes } from '@angular/router';
import { LandingComponent } from '../app-admin/components/landing/landing.component';
import { UsersComponent } from '../app-admin/components/users/users.component';
import { ListingComponent } from '../app-admin/components/listings/listing.component';
import { AdminGuard } from '../guards/admin.guard';
import {
	AppUrls as SharedUrls,
	FormContainerComponent,
	FourOFourComponent,
	LoginSignupGuard
} from 'mm-shared';
import { AppUrls } from './app.urls';
import { AdminListingGuard } from '../guards/admin-listing.guard';

export const routes: Routes = [
	{
		path: AppUrls.ROOT,
		component: LandingComponent,
		canActivate: [AdminGuard], //canMatch works well with LazyLoading
		children: [
			{ path: AppUrls.ROOT, redirectTo: AppUrls.USERS, pathMatch: 'full' },
			{ path: AppUrls.USERS, component: UsersComponent },
			{
				path: AppUrls.LISTINGS,
				component: ListingComponent,
				canActivate: [AdminListingGuard]
			}
		]
	},
	{
		path: SharedUrls.AUTH.LOGIN,
		component: FormContainerComponent,
		data: { type: 'login', portal: 'admin' },
		canActivate: [LoginSignupGuard]
	},

	{ path: SharedUrls.FOUROFOUR, component: FourOFourComponent },
	{ path: '**', redirectTo: SharedUrls.FOUROFOUR }
];
