import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { NavigationEnd, Params, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { IconPosition, RouteTarget } from '../../../../types/common.type';

/**
 * Navigation button component with router integration and active route detection.
 * 
 * Automatically highlights when the current route matches the button's target route.
 * Supports both internal navigation (routerLink) and external links.
 */
@Component({
	selector: 'mm-nav-button',
	templateUrl: './app-nav-button.component.html',
	styleUrls: ['./app-nav-button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavButtonComponent implements OnDestroy {

	/**
	 * Sets additional routes that should trigger the active state.
	 * Automatically subscribes to route changes when set.
	 * 
	 * @param activeRoutes - Array of route paths that should activate this button
	 */
	@Input('otherActiveRoutes') set otherActiveRoute(activeRoutes: string[]) {
		if (!activeRoutes?.length) return;
		this.otherActiveRoutes = activeRoutes;
		this.checkForActiveRoutes();
		this.subscribeForRouteChange();
	}

	/** Whether the device is mobile (affects styling) */
	@Input() isMobile = false;
	
	/** Whether this is used in the header (affects styling) */
	@Input() headerNav = false;
	
	/** Icon position: 'LEFT' or 'RIGHT' */
	@Input() iconPosition: IconPosition = 'LEFT';
	
	/** Whether this is a logout button (affects behavior) */
	@Input() isLogoutBtn = false;
	
	/** Whether to visually indicate when the route is active */
	@Input() indicateActiveBtn = false;
	
	/** Additional CSS classes */
	@Input() class = '';
	
	/** Button text label */
	@Input() text = '';
	
	/** Gap between icon and text (CSS value) */
	@Input() gap = '';
	
	/** Material icon name */
	@Input() icon = '';
	
	/** Whether to show the icon */
	@Input() showIcon = false;
	
	/** CSS classes for the icon */
	@Input() iconClass = '';
	
	/** CSS classes for the icon container */
	@Input() iconContainerClass = '';
	
	/** Whether the button is manually set to active state */
	@Input() active = false;
	
	/** CSS classes for the text element */
	@Input() textClass = '';
	
	/** Width on mobile devices (CSS value) */
	@Input() onMobileWidth = '';
	
	/** Angular router link (route path or array) */
	@Input() routerLink?: any[] | string;

	/** Query parameters for the route */
	@Input() queryParams?: Params | null;
	
	/** URL fragment (hash) */
	@Input() fragment?: string;
	
	/** Link target: '_blank' for external links */
	@Input() target?: RouteTarget;
	
	/** Whether to match route exactly (not as prefix) */
	@Input() exact: boolean = true;

	destroy$: Subject<void> = new Subject();
	otherActiveRoutes: string[] = [];
	isActiveRoute = false;

	constructor(
			private router: Router,
			private cdr: ChangeDetectorRef,
	) {
	}

	/**
	 * Subscribes to router navigation events to update active state.
	 * Called automatically when otherActiveRoutes is set.
	 */
	subscribeForRouteChange() {
		this.router.events.pipe(
				takeUntil(this.destroy$),
				filter(event => event instanceof NavigationEnd)
		).subscribe(() => {
			this.checkForActiveRoutes();
		});
	}

	/**
	 * Checks if the current route matches any of the active routes.
	 * Updates the isActiveRoute flag and triggers change detection.
	 */
	checkForActiveRoutes() {
		const url = this.router.url;
		this.isActiveRoute =
				this.otherActiveRoutes.some(r => url.includes(r));
		this.cdr.markForCheck();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
