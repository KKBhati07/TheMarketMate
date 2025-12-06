import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../app.constants';
import { LocalStorageService } from './local-storage.service';
import { ThemeOptions } from '../types/common.type';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private key = CONSTANTS.THEME.KEY;
	private className = 'light-theme';
	private activeTheme: ThemeOptions | null = null;

	constructor(private localStorageService: LocalStorageService) {
	}

	init() {
		const savedTheme = this.localStorageService.AppTheme;
		if (savedTheme === CONSTANTS.THEME.LIGHT) this.setLight();
		else if (savedTheme === CONSTANTS.THEME.DARK) this.setDark();
		else {
			this.setLight();
		}
	}

	setLight() {
		document.documentElement.classList.add(this.className);
		this.localStorageService.AppTheme = CONSTANTS.THEME.LIGHT as ThemeOptions;
		this.activeTheme = CONSTANTS.THEME.LIGHT as ThemeOptions;
	}


	setDark() {
		document.documentElement.classList.remove(this.className);
		this.localStorageService.AppTheme = CONSTANTS.THEME.DARK as ThemeOptions
		this.activeTheme = CONSTANTS.THEME.DARK as ThemeOptions;

	}

	toggle() {
		if (this.activeTheme === CONSTANTS.THEME.LIGHT) this.setDark();
		else this.setLight();
	}
}
