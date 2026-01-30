import { Routes } from '@angular/router';
import { FormContainerComponent } from 'mm-shared';
import { AppUrls as SharedUrls } from 'mm-shared';
import { LoginSignupGuard } from 'mm-shared';

export const authRoutes: Routes = [
	{
		path: SharedUrls.AUTH.LOGIN,
		component: FormContainerComponent,
		data: { type: 'login' },
		canActivate: [LoginSignupGuard]
	},
	{
		path: SharedUrls.AUTH.SIGNUP,
		component: FormContainerComponent,
		data: { type: 'signup' },
		canActivate: [LoginSignupGuard]
	}
];
