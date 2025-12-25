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

@Injectable({
	providedIn: 'root'
})
export class LoginSignupGuard implements CanActivate {
	constructor(private authService: AuthService,
							private router: Router) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		if (this.authService.Authenticated) {
			// return this.router.createUrlTree([AppUrls.ROOT])
			return this.router.createUrlTree([])
		}
		return true;
	}

}
