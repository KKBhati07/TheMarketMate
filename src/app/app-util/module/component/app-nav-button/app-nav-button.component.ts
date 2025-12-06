import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { IconPosition } from '../../../../shared/types/common.type';
import { NavigationEnd, Params, Router } from '@angular/router';
import { RouteTarget } from '../../../../shared/types/common.type';
import { filter, Subject, takeUntil } from 'rxjs';


@Component({
	selector: 'mm-nav-button',
	templateUrl: './app-nav-button.component.html',
	styleUrls: ['./app-nav-button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavButtonComponent implements OnDestroy {

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

	destroy$: Subject<void> = new Subject();
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
		).subscribe(() => {
			this.checkForActiveRoutes();
		});
	}

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
