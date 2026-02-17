import { Category } from '@marketmate/shared';
import { Condition } from '@marketmate/shared';
import { Location } from '@marketmate/shared';

export interface ListingImageDto {
	id: number;
	url: string;
	cover?: boolean;
	isCover?: boolean;
}

export interface ListingSellerDto {
	id: number;
	name: string;
	profileUrl?: string;
	deleted?: boolean;
	emailVerified?: boolean;
}

export interface ListingDetail {
	id: number;
	title: string;
	description: string;
	price: number;
	isSold?: boolean;
	sold?: boolean;
	postedAt?: string;
	posted_at?: string;
	category: Category;
	condition: Condition;
	seller?: ListingSellerDto;
	location?: Location;
	images?: ListingImageDto[];
}
