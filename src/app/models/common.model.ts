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

export type RouteTarget = '_self' | '_blank' | '_parent' | '_top';
