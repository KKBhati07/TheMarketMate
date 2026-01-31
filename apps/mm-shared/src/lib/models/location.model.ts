import { Common } from '../types/common.type';


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

export enum LocationType {
	CITY = 'CITY',
	STATE = 'STATE',
	COUNTRY = 'COUNTRY'
}

