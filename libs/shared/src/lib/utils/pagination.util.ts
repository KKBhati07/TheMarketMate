import { PaginatedResponse } from '../models/response.model';

export function calculateHasMore<T>(response: PaginatedResponse<T> | undefined, pageToLoad: number): boolean {
	if (!response) return false;

	if (response.total_pages !== undefined) {
		return (response.current_page ?? pageToLoad) < (response.total_pages - 1);
	}

	// Fallback: assume more pages if items were returned
	return (response.items?.length ?? 0) > 0;
}

export function calculateNextPage<T>(response: PaginatedResponse<T> | undefined, pageToLoad: number, append: boolean): number {
	if (!response) return pageToLoad + 1;
	
	if (append) {
		return (response.current_page ?? pageToLoad) + 1;
	} else {
		return (response.current_page ?? 0) + 1;
	}
}

export function extractItems<T>(response: PaginatedResponse<T> | undefined): T[] {
	return response?.items ?? [];
}
