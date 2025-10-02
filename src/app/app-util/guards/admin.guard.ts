import {
	ActivatedRouteSnapshot,
	CanActivate, Router,
	RouterStateSnapshot,
	UrlTree
} from '@angular/router';
import { AppUrls } from '../../app.urls';
import { AuthService } from '../../services/auth.service';
import { Injectable } from '@angular/core';


@Injectable(
		{providedIn: 'root'}
)
export class AdminGuard implements CanActivate {

	constructor(private router: Router,
							private authService: AuthService
							) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		if (!this.authService.IsAdmin) {
			return this.router.createUrlTree([AppUrls.ROOT])
		}
		return true;
	}
}