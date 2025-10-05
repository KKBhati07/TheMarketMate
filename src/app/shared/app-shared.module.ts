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

@NgModule({
	declarations: [
		AppConfirmDeleteDialogComponent,
		FourOFourComponent,
		ImageViewerComponent
	],
	imports: [
		MatDialogActions,
		MatDialogContent,
		MatIcon,
		AppUtilModule,
		CommonModule
	],
	exports: [
		ImageViewerComponent,
		FourOFourComponent,
		AppConfirmDeleteDialogComponent
	],
})
export class AppSharedModule {
}
