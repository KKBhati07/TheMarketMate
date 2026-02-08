import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './app-header/component/app-header.component';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		AppHeaderComponent
	],
	providers: [
		{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
		{ provide: MatBottomSheetRef, useValue: null }
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	title = 'mm-admin-portal';
}
