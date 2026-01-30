import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router, RouterStateSnapshot,
	UrlTree
} from '@angular/router';
import { AppUrls as SharedUrls } from 'mm-shared';
import { AuthService } from 'mm-shared';
import { Injectable } from '@angular/core';

/**
 * Route guard that protects admin routes by requiring authentication.
 * 
 * Redirects unauthenticated users to the login page. Does not check for
 * admin role - authentication is sufficient for access.
 *
 */
@Injectable(
		{ providedIn: 'root' }
)
export class AdminGuard implements CanActivate {

	constructor(private router: Router,
							private authService: AuthService
	) {
	}

	// //canMatch works well with LazyLoading
	// canMatch(route: Route, segments: UrlSegment[]): UrlTree | boolean {
	// 	if (!this.authService.Authenticated || !this.authService.IsAdmin) {
	// 		return this.router.createUrlTree([SharedUrls.AUTH.LOGIN])
	// 	}
	// 	return true;
	// }

	/**
	 * Determines if the route can be activated.
	 * 
	 * @param route - The activated route snapshot
	 * @param state - The router state snapshot
	 * @returns True if authenticated, UrlTree to redirect to login if not
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree | boolean {
		if (!this.authService.Authenticated) {
			return this.router.createUrlTree([SharedUrls.AUTH.BASE,SharedUrls.AUTH.LOGIN])
		}
		return true;
	}
}