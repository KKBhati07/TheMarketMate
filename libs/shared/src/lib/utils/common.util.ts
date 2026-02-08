import { CONSTANTS } from '../constants/app.constants';
import { CONDITION_COLORS } from '../constants/condition.constant';

export function getIconName(categoryName: string): string {
	switch (categoryName) {
		case CONSTANTS.CATEGORY.CAR:
			return CONSTANTS.CATEGORY_ICON.CAR;
		case CONSTANTS.CATEGORY.BIKE:
			return CONSTANTS.CATEGORY_ICON.BIKE;
		case CONSTANTS.CATEGORY.MOBILE:
			return CONSTANTS.CATEGORY_ICON.MOBILE;
		case CONSTANTS.CATEGORY.ELECTRONIC:
			return CONSTANTS.CATEGORY_ICON.ELECTRONIC;
		case CONSTANTS.CATEGORY.FURNITURE:
			return CONSTANTS.CATEGORY_ICON.FURNITURE;
		case CONSTANTS.CATEGORY.PROPERTY:
			return CONSTANTS.CATEGORY_ICON.PROPERTY;
		case CONSTANTS.CATEGORY.OTHER:
			return CONSTANTS.CATEGORY_ICON.OTHER;
		default:
			return CONSTANTS.CATEGORY_ICON.OTHER;
	}
}

export function getColors(label: string) {
	return CONDITION_COLORS[label] || { bg: '#f5f5f5', text: '#757575', active: '#000' };
}