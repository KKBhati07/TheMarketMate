export const AppUrls = {
	ROOT: '',
	HOME: 'home',
	AUTH: {
		LOGIN: 'auth/user_login',
		SIGNUP: 'auth/user_signup',
	},
	FOUROFOUR: 'fourofour',

	API: {
		V1: {
			USER: {
				CREATE: 'v1/user/create_user',
				UPDATE: 'v1/user/update_user',
				DELETE: (uuid: string) => (`v1/user/${ uuid }/delete_user`),
				USER_DETAILS: (uuid: string) => (`v1/user/${ uuid }/get_details`),
				UPDATE_USER: 'v1/user/update_user',
				UPLOAD_IMAGE_FALLBACK: 'v1/user/upload_image_fallback',
			},
			AUTH: {
				LOGIN: 'v1/auth/login_with_password',
				LOGOUT: 'v1/auth/logout',
				AUTH_DETAILS: 'v1/auth/auth_details'
			},
			STORAGE: {
				PRESIGN_URL: 'v1/storage/presign_url',
				OBJECT_EXISTS: 'v1/storage/object_exists',
			},
			FAVORITE: {
				SET_UNSET: 'v1/favorite/set_unset'
			}
		}
	}
}
