import { ProfileDetails } from './user.model';

export interface ProfileDetailsBottomSheetData {
	isBottomSheet: boolean;
	userDetails: ProfileDetails | null;
	isMobile: boolean;
}