import { Injectable } from '@angular/core';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	UrlTree
} from '@angular/router';
import { AppUrls } from '../../app.urls';

@Injectable({
	providedIn: "root",
})
export class AdminListingGuard implements CanActivate {
	constructor(private router: Router, private route: ActivatedRoute) {
	}

	canActivate(route: ActivatedRouteSnapshot): UrlTree | boolean {
		const posts = route.queryParamMap.get('posts');

		if (!posts) {
			return this.router.createUrlTree(
					[AppUrls.ADMIN.LANDING,
						AppUrls.ADMIN.LISTINGS
					], {
						relativeTo: this.route,
						queryParams: { posts: 'all' },
						queryParamsHandling: 'replace',
					});
		}
		return true;
	}
}