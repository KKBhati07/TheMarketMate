export type ThemeOptions = 'dark' | 'light';


export interface Common {
	id: number;
	name: string;
}


export type IconPosition = 'LEFT' | 'RIGHT';

export type RouteTarget = '_self' | '_blank' | '_parent' | '_top';

export type NavOption = 'CATEGORIES' | 'SELL_ITEM' | 'ADMIN' | 'LOGOUT';

export enum AppContext {
	ADMIN = 'ADMIN',
	PUBLIC = 'PUBLIC'
}