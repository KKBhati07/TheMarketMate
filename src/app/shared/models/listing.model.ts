import { Location } from './location.model';
import { Category } from './category.model';

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
