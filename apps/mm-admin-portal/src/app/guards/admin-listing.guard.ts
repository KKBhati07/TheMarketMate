import { Injectable } from '@angular/core';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	UrlTree
} from '@angular/router';
import { AppUrls } from '../utils/app.urls';

/**
 * Route guard that ensures listing routes have required query parameters.
 * 
 * Redirects to the listings page with default 'posts=all' query parameter
 * if the 'posts' query parameter is missing.
 */
@Injectable({
	providedIn: "root",
})
export class AdminListingGuard implements CanActivate {
	constructor(private router: Router, private route: ActivatedRoute) {
	}

	/**
	 * Determines if the route can be activated.
	 * 
	 * @param route - The activated route snapshot
	 * @returns True if 'posts' query param exists, UrlTree to redirect with default param otherwise
	 */
	canActivate(route: ActivatedRouteSnapshot): UrlTree | boolean {
		const posts = route.queryParamMap.get('posts');

		if (!posts) {
			return this.router.createUrlTree(
					[AppUrls.ROOT,
						AppUrls.LISTINGS
					], {
						relativeTo: this.route,
						queryParams: { posts: 'all' },
						queryParamsHandling: 'replace',
					});
		}
		return true;
	}
}