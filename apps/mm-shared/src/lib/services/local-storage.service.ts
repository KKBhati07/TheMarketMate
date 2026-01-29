import { Injectable } from '@angular/core';
import { CONSTANTS } from '../app.constants';
import { ThemeOptions } from '../types/common.type';

/**
 * Service for managing localStorage operations.
 * 
 * Provides typed access to application-specific localStorage values.
 * Currently handles theme preference storage.
 */
@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {

	/**
	 * Sets the application theme preference in localStorage.
	 * 
	 * @param theme - The theme to save ('light' or 'dark')
	 */
	set AppTheme(theme: ThemeOptions) {
		localStorage.setItem(CONSTANTS.THEME.KEY, theme);
	}

	/**
	 * Gets the application theme preference from localStorage.
	 * 
	 * @returns The saved theme, or 'light' as default if not set
	 */
	get AppTheme() {
		return (localStorage.getItem(CONSTANTS.THEME.KEY) ?? CONSTANTS.THEME.LIGHT) as ThemeOptions;
	}
}