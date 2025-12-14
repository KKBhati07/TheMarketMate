import { Location } from './location.model';
import { Category } from './category.model';

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

export interface Listing {
	id: number;
	title: string;
	description: string;
	price: number;
	is_deleted: boolean;
	category: Category;
	cover_image_url: string;
	posted_at: string;
	is_favorite: boolean;
	location?: Location;
}
