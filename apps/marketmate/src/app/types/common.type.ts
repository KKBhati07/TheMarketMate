import { UserDetailsDto } from 'mm-shared';

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
	userDetails: UserDetailsDto | null;
	isMobile: boolean;
}
