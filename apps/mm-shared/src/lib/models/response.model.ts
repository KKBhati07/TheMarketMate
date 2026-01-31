import { Category } from './category.model';
import { UserDetailsDto } from './user.model';

export interface PaginatedResponse<T> {
	items: T[];
	current_page: number;
	total_items: number;
	total_pages: number;
}

export interface CategoriesResponse {
	categories: Category[];
}

export interface UserDetailsResponse {
	user_details: UserDetailsDto;
	self: boolean;
}

export interface UpdateUserResponse {
	updated: boolean;
	self: boolean;
	user_details: UserDetailsDto;
}

export interface AuthDetailsResponse {
	auth_details: UserDetailsDto;
	is_authenticated: boolean;
}

export interface LogoutResponse {
	logged_out: boolean;
}

export interface CreateUserResponse {
	created: boolean;
	already_exists: boolean;
}

export interface LoginResponse {
	authenticated: boolean;
}
