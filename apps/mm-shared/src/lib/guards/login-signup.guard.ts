import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";
// import { AppUrls } from "../../../../marketmate/src/app/app.urls";

/**
 * Route guard that prevents authenticated users from accessing login/signup pages.
 * 
 * If a user is already authenticated, they are redirected to the home page.
 * Unauthenticated users are allowed to access the route.
 */
@Injectable({
	providedIn: 'root'
})
export class LoginSignupGuard implements CanActivate {
	constructor(private authService: AuthService,
							private router: Router) {
	}

	/**
	 * Determines if the route can be activated.
	 * 
	 * @param route - The activated route snapshot
	 * @param state - The router state snapshot
	 * @returns True if unauthenticated (allows access), UrlTree to redirect if authenticated
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		if (this.authService.Authenticated) {
			// return this.router.createUrlTree([AppUrls.ROOT])
			return this.router.createUrlTree([])
		}
		return true;
	}

}
