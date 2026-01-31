import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { ApiService } from "./api.service";
import { AppUrls } from "../common.urls";
import { Login, Signup } from "../models/login-signup.model";
import { ApiHttpResponse } from "../utils/api-response.util";
import { ApiResponse } from "../models/api-response.model";
import { AuthDetailsResponse, LogoutResponse, CreateUserResponse, LoginResponse } from "../models/response.model";
import { CookieService } from "ngx-cookie-service";
import { User } from "../models/user.model";
import { AppContext } from '../types/common.type';

/**
 * Maintains authentication state in memory to avoid repeated server calls.
 * 
 * State is updated via side effects in loadUserDetails() to keep it synchronized
 * with server session. The Subject-based update stream allows components to
 * react to user profile changes without polling.
 */
@Injectable()
export class AuthService {

	private userDetails: User | null = null;
	private isAuthenticated: boolean = false;
	private isAdmin: boolean = false;
	private updateUser$: Subject<User> = new Subject();

	constructor(private apiService: ApiService,
							private cookieService: CookieService) {
	}

	loadUserDetails(): Observable<ApiHttpResponse<ApiResponse<AuthDetailsResponse>>> {
		return this.apiService.get<ApiResponse<AuthDetailsResponse>>(AppUrls.API.V1.AUTH.AUTH_DETAILS).pipe(
				tap(res => {
					if (res.isSuccessful()) {
						this.isAuthenticated = res.body?.data?.is_authenticated || false;
						const authDetails = res.body?.data?.auth_details;
						if (authDetails) {
							this.userDetails = {
								name: authDetails.name,
								email: authDetails.email,
								uuid: authDetails.uuid,
								profile_url: authDetails.profile_url || undefined,
								is_admin: authDetails.is_admin,
								admin: authDetails.is_admin,
								contact_no: authDetails.contact_no
							};
							this.isAdmin = authDetails.is_admin;
						}
					}
				})
		);
	}

	signupUser(body: Signup): Observable<ApiHttpResponse<ApiResponse<CreateUserResponse>>> {
		return this.apiService.post(AppUrls.API.V1.USER.CREATE, body)
	}

	/**
	 * App context header distinguishes public vs admin portal logins,
	 * allowing the backend to issue context-specific sessions.
	 */
	loginUser(body: Login, appContext: AppContext): Observable<ApiHttpResponse<ApiResponse<LoginResponse>>> {
		return this.apiService.post<ApiResponse<LoginResponse>>(AppUrls.API.V1.AUTH.LOGIN, body, { 'X-App-Context': appContext })
	}

	logoutUser(): Observable<ApiHttpResponse<ApiResponse<LogoutResponse>>> {
		return this.apiService.post<ApiResponse<LogoutResponse>>(AppUrls.API.V1.AUTH.LOGOUT, {})
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
