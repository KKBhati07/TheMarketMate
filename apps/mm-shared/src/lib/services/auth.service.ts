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
 * Authentication service for managing user authentication state.
 * 
 * Handles login, signup, logout, and user session management.
 * Maintains authentication state and user details in memory.
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

	/**
	 * Loads user authentication details from the server.
	 * Updates internal authentication state on success.
	 * 
	 * @returns Observable of the API response containing authentication details
	 */
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

	/**
	 * Registers a new user account.
	 * 
	 * @param body - Signup credentials (email, password, etc.)
	 * @returns Observable of the API response
	 */
	signupUser(body: Signup): Observable<ApiHttpResponse<ApiResponse<CreateUserResponse>>> {
		return this.apiService.post(AppUrls.API.V1.USER.CREATE, body)
	}

	/**
	 * Authenticates a user and establishes a session.
	 * 
	 * @param body - Login credentials (email and password)
	 * @param appContext - Application context ('PUBLIC' or 'ADMIN')
	 * @returns Observable of the API response
	 */
	loginUser(body: Login, appContext: AppContext): Observable<ApiHttpResponse<ApiResponse<LoginResponse>>> {
		return this.apiService.post<ApiResponse<LoginResponse>>(AppUrls.API.V1.AUTH.LOGIN, body, { 'X-App-Context': appContext })
	}

	/**
	 * Logs out the current user and invalidates the session.
	 * 
	 * @returns Observable of the API response
	 */
	logoutUser(): Observable<ApiHttpResponse<ApiResponse<LogoutResponse>>> {
		return this.apiService.post<ApiResponse<LogoutResponse>>(AppUrls.API.V1.AUTH.LOGOUT, {})
	}

	/**
	 * Updates the current user details in memory.
	 * Emits the updated user to subscribers of getUpdatedUser().
	 * 
	 * @param user - Updated user object
	 */
	setUpdatedUser(user: User) {
		this.updateUser$.next(user);
	}

	/**
	 * Gets an observable stream of user updates.
	 * Emits whenever setUpdatedUser() is called.
	 * 
	 * @returns Observable that emits User objects on updates
	 */
	getUpdatedUser(): Observable<User> {
		return this.updateUser$.asObservable();
	}

	/**
	 * Gets whether the current user is authenticated.
	 * 
	 * @returns True if user is authenticated, false otherwise
	 */
	get Authenticated(): boolean {
		return this.isAuthenticated
	}

	/**
	 * Gets the current authenticated user's details.
	 * 
	 * @returns User object if authenticated, null otherwise
	 */
	get UserDetails(): User | null {
		return this.userDetails;
	}

	/**
	 * Gets whether the current user has admin privileges.
	 * 
	 * @returns True if user is an admin, false otherwise
	 */
	get IsAdmin(): boolean {
		return this.isAdmin;
	}
}
