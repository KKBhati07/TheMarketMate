export interface User {
	id?: number;
	name: string;
	uuid: string;
	profile_url?: string;
	email: string;
	is_admin: boolean;
	admin: boolean;
	contact_no: string | null;
	deleted?: boolean;
}

export interface UserDetailsDto {
	name: string;
	email: string;
	uuid: string;
	is_admin: boolean;
	contact_no: string | null;
	profile_url: string | null;
	deleted?: boolean;
}

export interface UpdateUserPayload {
	uuid: string;
	name?: string;
	email?: string;
	contact_no?: string | null;
	profileImage?: File | null;
	profile_url?: string;
}
