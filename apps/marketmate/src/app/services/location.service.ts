import { Injectable } from '@angular/core';
import { ApiService } from '@marketmate/shared';
import { AppUrls } from '../app.urls';
import { Observable } from 'rxjs';
import { ApiHttpResponse } from '@marketmate/shared';
import { ApiResponse } from '@marketmate/shared';
import { City, Country, State } from '@marketmate/shared';

@Injectable({
	providedIn: 'root'
})
export class LocationApiService {
	constructor(private readonly apiService: ApiService) {
	}

	getCountries(): Observable<ApiHttpResponse<ApiResponse<Country[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_COUNTRIES);
	}

	getStates(countryId: number): Observable<ApiHttpResponse<ApiResponse<State[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_STATES, { country_id: countryId });
	}

	getCities(stateId: number): Observable<ApiHttpResponse<ApiResponse<City[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_CITIES, { state_id: stateId });
	}


}