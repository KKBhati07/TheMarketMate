import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CONSTANTS } from '../constants/app.constants';
import { LocalStorageService } from './local-storage.service';
import { ThemeOptions } from '../types/common.type';

/**
 * Manages theme by manipulating document.documentElement.classList to avoid
 * CSS specificity issues. The 'light-theme' class is additive; dark mode
 * is the default when the class is absent.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
	private key = CONSTANTS.THEME.KEY;
	private className = 'light-theme';
	private activeTheme: ThemeOptions | null = null;
	private readonly isBrowser: boolean;

	constructor(
		private readonly localStorageService: LocalStorageService,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	init() {
		if (!this.isBrowser) {
			return;
		}
		const savedTheme = this.localStorageService.AppTheme;
		if (savedTheme === CONSTANTS.THEME.LIGHT) this.setLight();
		else if (savedTheme === CONSTANTS.THEME.DARK) this.setDark();
		else {
			this.setLight();
		}
	}

	setLight() {
		if (this.isBrowser && typeof document !== 'undefined') {
			document.documentElement.classList.add(this.className);
		}
		this.localStorageService.AppTheme = CONSTANTS.THEME.LIGHT as ThemeOptions;
		this.activeTheme = CONSTANTS.THEME.LIGHT as ThemeOptions;
	}

	setDark() {
		if (this.isBrowser && typeof document !== 'undefined') {
			document.documentElement.classList.remove(this.className);
		}
		this.localStorageService.AppTheme = CONSTANTS.THEME.DARK as ThemeOptions
		this.activeTheme = CONSTANTS.THEME.DARK as ThemeOptions;

	}

	toggle() {
		if (this.activeTheme === CONSTANTS.THEME.LIGHT) this.setDark();
		else this.setLight();
	}
}
