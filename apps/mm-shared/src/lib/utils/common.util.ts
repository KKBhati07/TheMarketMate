import { CONSTANTS } from '../app.constants';

/**
 * Gets the Material icon name for a given category.
 * 
 * Maps category names to their corresponding Material icon names.
 * Returns 'other' icon for unknown categories.
 * 
 * @param categoryName - The name of the category
 * @returns The Material icon name for the category
 */
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