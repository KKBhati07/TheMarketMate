import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from "./app-header/component/app-header.component";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		AppHeaderComponent,
		MatDialogModule,
	],
	providers: [
		{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
		{ provide: MatBottomSheetRef, useValue: null }
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	title = 'marketmate';
}

