import { Routes } from '@angular/router';
import { FormContainerComponent } from '@marketmate/shared';
import { AppUrls as SharedUrls } from '@marketmate/shared';
import { LoginSignupGuard } from '@marketmate/shared';

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
