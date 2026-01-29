import { Injectable } from '@angular/core';
import { ApiService } from 'mm-shared';
import { AppUrls } from '../app.urls';
import { Observable } from 'rxjs';
import { ApiHttpResponse } from 'mm-shared';
import { ApiResponse } from 'mm-shared';
import { City, Country, State } from 'mm-shared';

/**
 * Service for managing location data (countries, states, cities).
 * 
 * Provides hierarchical location data for marketplace listings.
 * Supports cascading selection: countries → states → cities.
 */
@Injectable({
	providedIn: 'root'
})
export class LocationApiService {
	constructor(private apiService: ApiService) {
	}

	/**
	 * Gets all available countries.
	 * 
	 * @returns Observable of the API response containing countries list
	 */
	getCountries(): Observable<ApiHttpResponse<ApiResponse<Country[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_COUNTRIES);
	}

	/**
	 * Gets all states for a specific country.
	 * 
	 * @param countryId - Country ID
	 * @returns Observable of the API response containing states list
	 */
	getStates(countryId: string): Observable<ApiHttpResponse<ApiResponse<State[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_STATES, { country_id: countryId });
	}

	/**
	 * Gets all cities for a specific state.
	 * 
	 * @param stateCode - State code/ID
	 * @returns Observable of the API response containing cities list
	 */
	getCities(stateCode: string): Observable<ApiHttpResponse<ApiResponse<City[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_CITIES, { state_id: stateCode });
	}


}