import { Injectable } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Platform } from "@angular/cdk/platform";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

/**
 * Service for detecting device type and screen size.
 * 
 * Determines if the current device is mobile based on screen width
 * or platform (iOS/Android). Uses Angular CDK's BreakpointObserver
 * for responsive breakpoint detection.
 */
@Injectable({
	providedIn: 'root'
})
export class DeviceDetectorService {
	private readonly MOBILE_MAX_WIDTH = '(max-width: 969px)';

	constructor(private breakpointObserver: BreakpointObserver,
							private platform: Platform) {
	}

	/**
	 * Determines if the current device is a mobile device.
	 * 
	 * Checks screen width (max 969px) or platform (iOS/Android).
	 * Result is cached and shared across subscribers.
	 * 
	 * @returns Observable that emits true for mobile devices, false otherwise
	 */
	isMobile(): Observable<boolean> {
		return this.breakpointObserver.observe([this.MOBILE_MAX_WIDTH]).pipe(map(
				res => res.matches || this.platform.IOS || this.platform.ANDROID
		), shareReplay(1))
	}
}
