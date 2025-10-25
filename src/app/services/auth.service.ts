import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { ApiService } from "./api.service";
import { AppUrls } from "../app.urls";
import { Login, Signup } from "../models/login-signup.model";
import { ApiHttpResponse } from "../app-util/api-response.util";
import { ApiResponse } from "../models/api-response.model";
import { CookieService } from "ngx-cookie-service";
import { User } from "../models/user.model";


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private userDetails: User | null = null;
	private isAuthenticated: boolean = false;
	private isAdmin: boolean = false;
	private updateUser$: Subject<User> = new Subject();

	constructor(private apiService: ApiService,
							private cookieService: CookieService) {
	}


	loadUserDetails(): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.get<ApiResponse<any>>(AppUrls.API.V1.AUTH.AUTH_DETAILS).pipe(
				tap(res => {
					if (res.isSuccessful()) {
						this.isAuthenticated = res.body?.data?.authenticated || false;
						this.userDetails = res.body?.data?.auth_details;
						this.isAdmin = res.body?.data?.auth_details?.admin;
					} else {
						this.cookieService.delete('sessionid');
					}
				})
		);
	}

	signupUser(body: Signup): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.post(AppUrls.API.V1.USER.CREATE, body)
	}

	loginUser(body: Login): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.post<ApiResponse<any>>(AppUrls.API.V1.AUTH.LOGIN, body).pipe(
				tap((res: ApiHttpResponse<ApiResponse<any>>) => {
					if (res.isSuccessful()) {
						if (res.body?.data?.authenticated) {
							this.cookieService.set('sessionid', res.body.data?.sessionId, undefined, '/');
							this.userDetails = res.body?.data?.auth_details;
							this.isAuthenticated = true;
						}
					}
				}))
	}

	logoutUser(): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.post<ApiResponse<any>>(AppUrls.API.V1.AUTH.LOGOUT, {}).pipe(
				tap((res: ApiHttpResponse<ApiResponse<any>>) => {
					if (res.isSuccessful()) {
						this.cookieService.delete('sessionid');

					}
				}))
	}

	setUpdatedUser(user: User) {
		this.updateUser$.next(user);
	}

	getUpdatedUser(): Observable<User> {
		return this.updateUser$.asObservable();
	}

	get Authenticated(): boolean {
		return this.isAuthenticated
	}


	get UserDetails(): User | null {
		return this.userDetails;
	}

	get IsAdmin(): boolean {
		return this.isAdmin;
	}


}
