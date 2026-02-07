import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CONSTANTS } from '../constants/app.constants';
import { ThemeOptions } from '../types/common.type';

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	private readonly isBrowser: boolean;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	set AppTheme(theme: ThemeOptions) {
		if (this.isBrowser) {
			localStorage.setItem(CONSTANTS.THEME.KEY, theme);
		}
	}

	get AppTheme() {
		if (this.isBrowser) {
			return (localStorage.getItem(CONSTANTS.THEME.KEY) ?? CONSTANTS.THEME.LIGHT) as ThemeOptions;
		}
		return CONSTANTS.THEME.LIGHT as ThemeOptions;
	}
}