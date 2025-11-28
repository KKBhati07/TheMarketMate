import { Routes } from '@angular/router';
import { AdminLandingComponent } from './components/admin-landing/admin-landing.component';
import { AdminGuard } from '../app-util/guards/admin.guard';
import { AppUrls } from '../app.urls';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminListingComponent } from './components/admin-listings/admin-listing.component';

export const adminRoutes: Routes = [
	{
		path: '',
		component: AdminLandingComponent,
		canActivate: [AdminGuard],
		children: [
			{ path: '', redirectTo: AppUrls.ADMIN.USERS, pathMatch: 'full' },
			{ path: AppUrls.ADMIN.USERS, component: AdminUsersComponent },
			{ path: AppUrls.ADMIN.LISTINGS, component: AdminListingComponent }
		]
	}
];