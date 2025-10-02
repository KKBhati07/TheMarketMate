import { Redirect } from './login-signup.model';

export type NavOption = Redirect | 'USER_PROFILE'
		| 'CATEGORIES' | 'HOME' | 'ADMIN';