import { Routes } from '@angular/router';
import { FormContainerComponent, AppUrls as SharedUrls, LoginSignupGuard } from 'mm-shared';

export const authRoutes: Routes = [
	{
		path: SharedUrls.AUTH.LOGIN,
		component: FormContainerComponent,
		data: { type: 'login', portal: 'admin' },
		canActivate: [LoginSignupGuard]
	}
];
