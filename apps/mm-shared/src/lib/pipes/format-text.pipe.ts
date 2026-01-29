import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

/**
 * Pipe for formatting text by replacing underscores with spaces and converting to title case.
 * 
 * Useful for displaying enum values or snake_case strings in a user-friendly format.
 */
@Pipe({
	standalone: true,
	name: 'formatText'
})
@Injectable({
	providedIn: 'root'
})
export class FormatTextPipe implements PipeTransform {
	private titleCasePipe = new TitleCasePipe();

	/**
	 * Transforms the input string by replacing underscores with spaces and converting to title case.
	 * 
	 * @param value - The string to format (can be undefined)
	 * @returns Formatted string, or empty string if input is undefined
	 */
	transform(value: string | undefined): string {
		if (!value) return '';
		const formatted = value.replaceAll(/_/g, ' ');
		return this.titleCasePipe.transform(formatted);
	}
}
