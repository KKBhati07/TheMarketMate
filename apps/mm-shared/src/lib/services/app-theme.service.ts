import { Injectable } from '@angular/core';
import { CONSTANTS } from '../app.constants';
import { LocalStorageService } from './local-storage.service';
import { ThemeOptions } from '../types/common.type';

/**
 * Service for managing application theme (light/dark mode).
 * 
 * Handles theme initialization, switching, and persistence.
 * Applies theme classes to the document root element.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
	private key = CONSTANTS.THEME.KEY;
	private className = 'light-theme';
	private activeTheme: ThemeOptions | null = null;

	constructor(private localStorageService: LocalStorageService) {
	}

	/**
	 * Initializes the theme from localStorage or defaults to light theme.
	 * Should be called during application bootstrap.
	 */
	init() {
		const savedTheme = this.localStorageService.AppTheme;
		if (savedTheme === CONSTANTS.THEME.LIGHT) this.setLight();
		else if (savedTheme === CONSTANTS.THEME.DARK) this.setDark();
		else {
			this.setLight();
		}
	}

	/**
	 * Sets the application theme to light mode.
	 * Applies CSS class and persists preference.
	 */
	setLight() {
		document.documentElement.classList.add(this.className);
		this.localStorageService.AppTheme = CONSTANTS.THEME.LIGHT as ThemeOptions;
		this.activeTheme = CONSTANTS.THEME.LIGHT as ThemeOptions;
	}

	/**
	 * Sets the application theme to dark mode.
	 * Removes light theme class and persists preference.
	 */
	setDark() {
		document.documentElement.classList.remove(this.className);
		this.localStorageService.AppTheme = CONSTANTS.THEME.DARK as ThemeOptions
		this.activeTheme = CONSTANTS.THEME.DARK as ThemeOptions;

	}

	/**
	 * Toggles between light and dark themes.
	 */
	toggle() {
		if (this.activeTheme === CONSTANTS.THEME.LIGHT) this.setDark();
		else this.setLight();
	}
}
