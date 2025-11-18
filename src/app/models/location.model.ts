import { Common } from './common.model';


export interface Location {
	city: City;
	state: State;
	country: Country;
}

export interface Country extends Common {
}

export interface State extends Common {
}

export interface City extends Common {
}

export type LocationType = 'CITY' | 'STATE' | 'COUNTRY';

