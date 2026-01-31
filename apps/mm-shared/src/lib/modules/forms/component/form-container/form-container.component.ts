import { ChangeDetectionStrategy, Type, ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "../../../../services/device-detector.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { LoginFormComponent } from "../login-form/login-form.component";
import { SignupFormComponent } from "../signup-form/signup-form.component";
import { Subject, takeUntil } from "rxjs";
import { AppUrls } from "../../../../common.urls";

/**
 * Opens forms in bottom sheet on mobile for better UX than full-page forms.
 */
@Component({
	selector: 'mm-form-container',
	templateUrl: './form-container.component.html',
	styleUrls: ['./form-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormContainerComponent implements OnInit, OnDestroy {
	isLoginForm = true;
	isAdMInPortal = false;
	slideFrom = false;
	isMobile = true;
	destroy$: Subject<boolean> = new Subject<boolean>();

	constructor(
			private cdr: ChangeDetectorRef,
			private route: ActivatedRoute,
			private router: Router,
			private deviceDetector: DeviceDetectorService,
			private bottomSheet: MatBottomSheet,
	) {
	}

	ngOnInit() {
		this.setDataFromSnapshot();
		this.setISMobile();
	}

	private setDataFromSnapshot() {
		this.isLoginForm = this.route.snapshot.data['type'] === 'login';
		this.isAdMInPortal = this.route.snapshot.data['portal'] === 'admin';
	}

	private setISMobile() {
		this.deviceDetector.isMobile()
				.pipe(takeUntil(this.destroy$))
				.subscribe(isMobile => {
					this.isMobile = isMobile;
					if (this.isMobile) {
						this.openFormInBottomSheet()
					}
					this.cdr.markForCheck();
				})
	}

	private openFormInBottomSheet() {
		const panelClass = 'login-signup-bottomsheet-container'
		const backdropClass = 'login-signup-bottomsheet-backdrop'
		const component: Type<LoginFormComponent | SignupFormComponent> =
				this.isLoginForm ? LoginFormComponent : SignupFormComponent;
		this.bottomSheet.open(component, {
			panelClass: panelClass,
			backdropClass: backdropClass,
			data: {
				openInBottomSheet: true,
			}

		}).afterDismissed().pipe(takeUntil(this.destroy$)).subscribe(action => {
			if (action === 'redirect_to_signup') {
				this.router.navigate([AppUrls.AUTH.BASE,AppUrls.AUTH.SIGNUP]).then(r => null);
			} else if (!action) {
				this.router.navigate([AppUrls.ROOT]).then(r => null);
			}
		})
	}

	ngOnDestroy() {
		this.destroy$.next(true)
		this.destroy$.complete();
	}
}
