import { Injectable } from '@angular/core';
import { ApiService } from 'mm-shared';
import { AppUrls } from '../app.urls';
import { Observable } from 'rxjs';
import { ApiHttpResponse } from 'mm-shared';
import { ApiResponse } from 'mm-shared';
import { City, Country, State } from 'mm-shared';

@Injectable({
	providedIn: 'root'
})
export class LocationApiService {
	constructor(private apiService: ApiService) {
	}

	getCountries(): Observable<ApiHttpResponse<ApiResponse<Country[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_COUNTRIES);
	}

	getStates(countryId: string): Observable<ApiHttpResponse<ApiResponse<State[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_STATES, { country_id: countryId });
	}

	getCities(stateCode: string): Observable<ApiHttpResponse<ApiResponse<City[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_CITIES, { state_id: stateCode });
	}


}