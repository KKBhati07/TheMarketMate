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

	CHAT: 'chat',

	FOUROFOUR: 'fourofour',

	API: {
		V1: {
			USER: {
				// CREATE: 'v1/user/create_user',
				// UPDATE: 'v1/user/update_user', // MOved to common!!
				DELETE: (uuid: string) => (`v1/user/${ uuid }/delete_user`),
				USER_DETAILS: (uuid: string) => (`v1/user/${ uuid }/get_details`),
				UPDATE_USER: 'v1/user/update_user',
				UPLOAD_IMAGE_FALLBACK: 'v1/user/upload_image_fallback',
			},
			CATEGORY: {
				GET_ALL: 'v1/category/get_all',
			},
			ADMIN: {
				USERS: {
					GET_ALL: 'v1/admin/users/get_all',
					USER_DETAILS: (uuid: string) => (`v1/admin/users/${ uuid }/get_details`),
					UPDATE: 'v1/admin/users/update_user',
					DELETE: (uuid: string) => (`v1/admin/users/delete_user/${ uuid }`),
					RESTORE: (uuid: string) => (`v1/admin/users/restore_user/${ uuid }`),
				},
				LISTINGS: {
					GET_ALL: 'v1/admin/listings/get_all',
					GET_DETAILS: (listingId: string) => (`v1/admin/listings/${ listingId }/get_details`),
					UPDATE: 'v1/admin/listings/update_item',
					DELETE: 'v1/admin/listings/delete',
				}
			},
			LISTING: {
				CREATE: 'v1/listing/create',
				GET_ALL: 'v1/listing/get_all',
				GET_BY_USER: 'v1/listing/get_by_user',
				GET_FAVORITES: 'v1/listing/get_favorites',
				IMAGE_UPLOAD_FALLBACK: 'v1/listing/image_upload_fallback',
			},
			LOCATION: {
				GET_COUNTRIES: 'v1/location/get_countries',
				GET_STATES: 'v1/location/get_states',
				GET_CITIES: 'v1/location/get_cities',
			},
		}
	}
}
