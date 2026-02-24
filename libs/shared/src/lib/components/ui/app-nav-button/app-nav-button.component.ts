import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { NavigationEnd, Params, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { IconPosition, RouteTarget } from '../../../types/common.type';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';

@Component({
	selector: 'mm-nav-button',
	templateUrl: './app-nav-button.component.html',
	styleUrls: ['./app-nav-button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class AppNavButtonComponent implements OnDestroy {

	/**
	 * Side effect: Automatically subscribes to router events when set.
	 */
	@Input('otherActiveRoutes') set otherActiveRoute(activeRoutes: string[]) {
		if (!activeRoutes?.length) return;
		this.otherActiveRoutes = activeRoutes;
		this.checkForActiveRoutes();
		this.subscribeForRouteChange();
	}

	@Input() isMobile = false;
	@Input() headerNav = false;
	@Input() iconPosition: IconPosition = 'LEFT';
	@Input() isLogoutBtn = false;
	@Input() indicateActiveBtn = false;
	@Input() class = '';
	@Input() text = '';
	@Input() gap = '';
	@Input() icon = '';
	@Input() showIcon = false;
	@Input() iconClass = '';
	@Input() iconContainerClass = '';
	@Input() active = false;
	@Input() textClass = '';
	@Input() onMobileWidth = '';
	@Input() routerLink?: any[] | string;
	@Input() queryParams?: Params | null;
	@Input() fragment?: string;
	@Input() target?: RouteTarget;
	@Input() exact: boolean = true;

	destroy$: Subject<void> = new Subject<void>();
	otherActiveRoutes: string[] = [];
	isActiveRoute = false;

	constructor(
			private router: Router,
			private cdr: ChangeDetectorRef,
	) {
	}

	subscribeForRouteChange() {
		this.router.events.pipe(
				takeUntil(this.destroy$),
				filter(event => event instanceof NavigationEnd)
		).subscribe((e) => {
			this.checkForActiveRoutes(e.url);
		});
	}

	checkForActiveRoutes(url?: string) {
		url = url ?? this.router.url ?? '';
		const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;
		this.isActiveRoute = this.otherActiveRoutes.some(r => {
			const normalizedRoute = r.startsWith('/') ? r.slice(1) : r;
			return normalizedUrl.includes(normalizedRoute);
		});
		this.cdr.markForCheck();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
