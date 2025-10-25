import { NgModule } from "@angular/core";
import {
	AppConfirmDeleteDialogComponent
} from "./components/confirm-delete-dialog/app-confirm-delete-dialog.component";
import { MatDialogActions, MatDialogContent } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { FourOFourComponent } from "./components/four-o-four/four-o-four.component";
import { AppUtilModule } from '../app-util/module/app-util.module';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { CommonModule, NgIf } from '@angular/common';
import { PublishEditListingFormComponent } from './components/publish-listing-form/publish-edit-listing-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormatTextPipe } from '../app-util/pipes/format-text.pipe';
import { ImageUploadIconComponent } from './components/image-upload-icon/image-upload-icon.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';

@NgModule({
	declarations: [
		AppConfirmDeleteDialogComponent,
		FourOFourComponent,
		ImageViewerComponent,
		PublishEditListingFormComponent,
		ImagePreviewComponent,
		ImageUploadIconComponent
	],
	imports: [
		MatDialogActions,
		MatDialogContent,
		MatIcon,
		AppUtilModule,
		ReactiveFormsModule,
		CommonModule,
		FormatTextPipe
	],
	exports: [
		ImageViewerComponent,
		FourOFourComponent,
		AppConfirmDeleteDialogComponent,
		PublishEditListingFormComponent
	],
})
export class AppSharedModule {
}
