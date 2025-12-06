import { ProfileDetails } from '../models/user.model';

export interface Common {
	id: number;
	name: string;
}

export interface ProductImage {
	image: File;
	previewUrl: string;
	isCover: boolean
}

export interface PriceRange {
	min: number;
	max: number;
}

export interface ProfileDetailsBottomSheetData {
	isBottomSheet: boolean;
	userDetails: ProfileDetails | null;
	isMobile: boolean;
}

export type IconPosition = 'LEFT' | 'RIGHT';

export type RouteTarget = '_self' | '_blank' | '_parent' | '_top';

export type NavOption = 'CATEGORIES' | 'SELL_ITEM';