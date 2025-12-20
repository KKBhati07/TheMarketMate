import { Listing } from 'mm-shared';

export interface CreateListingPayload {
	title: string;
	description: string;
	price: number;
	category_id: number;
	country_id: number;
	state_id: number;
	city_id: number;
	images: PayloadImage[];
}

export interface PayloadImage {
	object_key: string;
	is_cover: boolean;
}

export interface ListingResponse {
	current_page: number
	items: Listing[]
	total_pages?: number
	total_items?: number
}