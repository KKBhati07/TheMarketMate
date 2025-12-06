import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../app.constants';
import { ThemeOptions } from '../types/common.type';

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {

	set AppTheme(theme: ThemeOptions) {
		localStorage.setItem(CONSTANTS.THEME.KEY, theme);
	}

	get AppTheme() {
		return (localStorage.getItem(CONSTANTS.THEME.KEY) ?? CONSTANTS.THEME.LIGHT) as ThemeOptions;
	}
}