import { Category } from '@marketmate/shared';
import { Condition } from '@marketmate/shared';

export interface ListingLocationDto {
	city?: { id: number; name: string } | null;
	state?: { id: number; name: string } | null;
	country?: { id: number; name: string } | null;
}

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
	category?: Category | null;
	condition?: Condition | null;
	seller?: ListingSellerDto;
	location?: ListingLocationDto | null;
	images?: ListingImageDto[];
}
