import {
	CanMatch,
	Route,
	Router,
	UrlSegment,
	UrlTree
} from '@angular/router';
import { AppUrls } from '../utils/app.urls';
import { AuthService } from 'mm-shared';
import { Injectable } from '@angular/core';


@Injectable(
		{ providedIn: 'root' }
)
export class AdminGuard implements CanMatch {

	constructor(private router: Router,
							private authService: AuthService
	) {}

	canMatch(route: Route, segments: UrlSegment[]): UrlTree | boolean {
		if (!this.authService.IsAdmin) {
			return this.router.createUrlTree([AppUrls.ROOT])
		}
		return true;
	}
}