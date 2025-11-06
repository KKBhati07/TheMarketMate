import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { AppHeaderModule } from "./app-header/app-header.module";
import { FormsContainerModule } from "./forms-container/forms-container.module";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { AppAdminModule } from "./app-admin/app-admin.module";
import { AppSharedModule } from "./shared/app-shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { AppRootModule } from './app-root/app-root.module';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		AppHeaderModule,
		FormsContainerModule,
		UserProfileModule,
		AppAdminModule,
		AppSharedModule,
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

	constructor(private authService: AuthService) {
	}

	ngOnInit() {
	}
}

