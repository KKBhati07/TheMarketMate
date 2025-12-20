import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderModule } from "./app-header/app-header.module";
// import { For } from "./forms-container/forms-container.module";
import {FormsModule} from 'mm-shared';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { MatDialogModule } from "@angular/material/dialog";
import { AppRootModule } from './app-root/app-root.module';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		AppHeaderModule,
		FormsModule,
		UserProfileModule,
		MatDialogModule,
		AppRootModule
	],
	providers: [
		{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
		{ provide: MatBottomSheetRef, useValue: null }
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
	title = 'marketmate';

	constructor() {
	}

	ngOnInit() {
	}
}

