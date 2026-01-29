import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot, UrlTree
} from "@angular/router";
import { AuthService } from "mm-shared";
import { AppUrls } from '../utils/app.urls';
import { Injectable } from "@angular/core";

/**
 * Route guard that controls access to user profile pages.
 * 
 * Allows access if:
 * - User is an admin, OR
 * - User is viewing their own profile
 *
 * Otherwise redirects to the public user profile view.
 */
@Injectable({
	providedIn: 'root'
})
export class UserProfileGuard implements CanActivate {

	constructor(private authService: AuthService,
							private router: Router) {
	}

	/**
	 * Determines if the route can be activated.
	 * 
	 * @param route - The activated route snapshot
	 * @param state - The router state snapshot
	 * @returns True if admin or own profile, UrlTree to redirect otherwise
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		const profileUuid = route.params['uuid'];
		if (this.authService.IsAdmin
				|| profileUuid ===
				this.authService.UserDetails?.uuid) {
			return true;
		}
		return this.router.createUrlTree([AppUrls.USERS]);

	}

}
