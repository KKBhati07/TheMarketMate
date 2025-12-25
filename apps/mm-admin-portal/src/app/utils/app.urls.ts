export const AppUrls = {
	ROOT: '',
	USERS: 'users',
	LISTINGS: 'listings',

	FOUROFOUR: 'fourofour',

	API: {
		V1: {
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
			}
		}
	}
}
