import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AppUrls } from '../app.urls';

export const userProfileRoutes: Routes = [
	{
		path: AppUrls.USER.USER_PROFILE(),
		component: UserProfileComponent
	}
];
