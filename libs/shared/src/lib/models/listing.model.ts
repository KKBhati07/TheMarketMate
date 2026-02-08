import { Location } from './location.model';
import { Category } from './category.model';
import { Condition } from './condition.model';


export interface Listing {
	id: number;
	title: string;
	description: string;
	price: number;
	is_deleted: boolean;
	category: Category;
	cover_image_url: string;
	condition: Condition;
	posted_at: string;
	is_favorite: boolean;
	location?: Location;
}
