import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppUrls } from '../app.urls';
import { Observable } from 'rxjs';
import { ApiHttpResponse } from '../app-util/api-response.util';
import { ApiResponse } from '../models/api-response.model';
import { City, Country, State } from '../models/location.model';

@Injectable({
	providedIn: 'root'
})
export class LocationApiService {
	constructor(private apiService: ApiService) { }

	getCountries():Observable<ApiHttpResponse<ApiResponse<Country[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_COUNTRIES);
	}

	getStates(countryCode: string): Observable<ApiHttpResponse<ApiResponse<State[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_STATES, { country_id: countryCode });
	}

	getCities(stateCode: string): Observable<ApiHttpResponse<ApiResponse<City[]>>> {
		return this.apiService.get(AppUrls.API.V1.LOCATION.GET_CITIES, { state_id: stateCode });
	}


}