import { Injectable } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Platform } from "@angular/cdk/platform";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class DeviceDetectorService {
	private readonly MOBILE_MAX_WIDTH = '(max-width: 969px)';

	constructor(private breakpointObserver: BreakpointObserver,
							private platform: Platform) {
	}

	/**
	 * Uses shareReplay(1) to cache the breakpoint observation result,
	 * preventing duplicate subscriptions and unnecessary CDK observer overhead.
	 */
	isMobile(): Observable<boolean> {
		return this.breakpointObserver.observe([this.MOBILE_MAX_WIDTH]).pipe(map(
				res => res.matches || this.platform.IOS || this.platform.ANDROID
		), shareReplay(1))
	}
}
