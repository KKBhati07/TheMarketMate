import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot, UrlTree
} from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";
import { AppUrls } from "../../app.urls";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class UserProfileGuard implements CanActivate {

	constructor(private authService: AuthService,
							private router: Router) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		const profileUuid = route.params['uuid'];
		if (this.authService.IsAdmin
				|| profileUuid ===
				this.authService.UserDetails?.uuid) {
			return true;
		}
		return this.router.createUrlTree([AppUrls.USER.USER_PROFILE(profileUuid)]);

	}

}
