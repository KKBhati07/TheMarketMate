import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Pipe({
	standalone: true,
	name: 'formatText'
})
@Injectable({
	providedIn: 'root'
})
export class FormatTextPipe implements PipeTransform {
	private titleCasePipe = new TitleCasePipe();

	transform(value: string | undefined): string {
		if (!value) return '';
		const formatted = value.replaceAll(/_/g, ' ');
		return this.titleCasePipe.transform(formatted);
	}
}
