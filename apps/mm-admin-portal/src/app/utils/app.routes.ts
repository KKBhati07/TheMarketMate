import { Routes } from '@angular/router';
import { LandingComponent } from '../app-admin/components/landing/landing.component';
import { UsersComponent } from '../app-admin/components/users/users.component';
import { ListingComponent } from '../app-admin/components/listings/listing.component';
import { AdminGuard } from '../guards/admin.guard';
import { AppUrls } from './app.urls';
import { AdminListingGuard } from '../guards/admin-listing.guard';

export const routes: Routes = [

	{
		path: 'admin',
		component: LandingComponent,
		canMatch: [AdminGuard],
		children: [
			{ path: '', redirectTo: AppUrls.ADMIN.USERS, pathMatch: 'full' },
			{ path: AppUrls.ADMIN.USERS, component: UsersComponent },
			{
				path: AppUrls.ADMIN.LISTINGS,
				canActivate: [AdminListingGuard],
				component: ListingComponent
			}
		]
	}
];
