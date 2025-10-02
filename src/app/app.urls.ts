export const AppUrls = {
	ROOT: '',
	HOME: 'home',
	AUTH: {
		LOGIN: 'auth/user_login',
		SIGNUP: 'auth/user_signup',
	},
	USER: {
		USER_PROFILE: (uuid: string | null = null) => (`user/${ uuid ? uuid : ':uuid' }`)
	},
	ADMIN: {
		LANDING: 'admin',
		USERS: 'admin/users',
		LISTINGS: 'admin/listings',
	},
	FOUROFOUR: 'fourofour',

	API: {
		V1: {
			USER: {
				CREATE: 'v1/user/create_user',
				UPDATE: 'v1/user/update_user',
				// DELETE: 'v1/user/delete_user',
				DELETE: (uuid: string) => (`v1/user/${ uuid }/delete_user`),
				USER_DETAILS: (uuid: string) => (`v1/user/${ uuid }/get_details`),
				UPDATE_USER: 'v1/user/update_user',
			},
			AUTH: {
				LOGIN: 'v1/auth/login_with_password',
				LOGOUT: 'v1/auth/logout',
				AUTH_DETAILS: 'v1/auth/auth_details'
			},
			CATEGORY: {
				GET_ALL: 'v1/category/get_all',
			},
			ADMIN: {
				USERS: {
					GET_ALL: 'v1/admin/users/fetch_all',
					USER_DETAILS: (uuid: string) => (`v1/admin/users/${ uuid }/get_details`),
					UPDATE: 'v1/admin/users/update_user',
					DELETE: (uuid: string) => (`v1/admin/users/delete_user/${ uuid }`),
					RESTORE: (uuid: string) => (`v1/admin/users/restore_user/${ uuid }`),
				},
				LISTINGS: {
					GET_ALL: 'v1/admin/listings/get_all',
					GET_DETAILS: (listingId: string) => (`v1/admin/listings/${ listingId }/get_details`),
					UPDATE: 'v1/admin/listings/update_item',
					DELETE: 'v1/admin/listings/delete_item',
				}
			}
		}
	}
}
