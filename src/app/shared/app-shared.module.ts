import {NgModule} from "@angular/core";
import {AppConfirmDeleteDialogComponent} from "./components/confirm-delete-dialog/app-confirm-delete-dialog.component";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";

@NgModule({
  declarations: [AppConfirmDeleteDialogComponent],
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatIcon
  ],
  exports: [],
})
export class AppSharedModule {
}
