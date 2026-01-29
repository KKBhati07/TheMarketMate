import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from './components/app-button/app-button.component';
import { BottomSheetPillComponent } from './components/bottomsheet-pill/bottomsheet-pill.component';
import { AppNavButtonComponent } from './components/app-nav-button/app-nav-button.component';
import { BackForwardIconComponent } from './components/back-forward-icon/back-forward-icon.component';
import { CloseBtnComponent } from './components/close-btn/close-btn.component';
import {
	AppConfirmDeleteDialogComponent
} from './components/confirm-delete-dialog/app-confirm-delete-dialog.component';
import { FourOFourComponent } from './components/four-o-four/four-o-four.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormatTextPipe } from '../../pipes/format-text.pipe';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { SHARED_LIB_CONFIG, SharedLibConfig } from '../../utils/tokens.util';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { UserProfileEditComponent } from './components/user-profile-edit/user-profile-edit.component';
import { FavoriteService } from '../../services/favorite.service';

/**
 * Shared module providing core UI components and services.
 * 
 * Exports reusable components like buttons, loaders, dialogs, and image viewers.
 * Provides core services (ApiService, AuthService, StorageService, FavoriteService)
 * when used with forRoot() configuration.
 */
@NgModule({
	declarations: [
		AppButtonComponent,
		BottomSheetPillComponent,
		AppNavButtonComponent,
		BackForwardIconComponent,
		CloseBtnComponent,
		AppConfirmDeleteDialogComponent,
		FourOFourComponent,
		ImageViewerComponent,
		ImagePreviewComponent,
		AppLoaderComponent,
		UserProfileEditComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatSlider, // Standalone Component
		MatSliderRangeThumb, // Standalone Component
		MatDialogActions,
		MatDialogContent,
		ReactiveFormsModule,
		RouterModule,
		FormatTextPipe,
	],
	exports: [
		AppButtonComponent,
		BottomSheetPillComponent,
		AppNavButtonComponent,
		BackForwardIconComponent,
		CloseBtnComponent,
		AppConfirmDeleteDialogComponent,
		FourOFourComponent,
		ImageViewerComponent,
		ImagePreviewComponent,
		AppLoaderComponent,
		UserProfileEditComponent,
	]
})
export class SharedModule {
	/**
	 * Configures the SharedModule with application-specific settings.
	 * 
	 * Provides core services (ApiService, AuthService, StorageService, FavoriteService)
	 * with the specified configuration. Must be called in the root module/app config.
	 * 
	 * @param config - Configuration object containing API URL
	 * @returns ModuleWithProviders for use in app configuration
	 */
	static forRoot(config: SharedLibConfig): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: [
				ApiService,
				AuthService,
				StorageService,
				FavoriteService,
				{ provide: SHARED_LIB_CONFIG, useValue: config }
			]
		};
	}
}