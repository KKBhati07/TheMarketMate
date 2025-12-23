import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppAdminModule } from './app-admin/app-admin.module';
import { AppHeaderModule } from './app-header/app-header.module';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { NotificationModule } from 'mm-shared';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		AppAdminModule,
		AppHeaderModule,
		NotificationModule
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
