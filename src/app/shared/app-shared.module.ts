import {NgModule} from "@angular/core";
import {AppConfirmDeleteDialogComponent} from "./components/confirm-delete-dialog/app-confirm-delete-dialog.component";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {FourOFourComponent} from "./components/four-o-four/four-o-four.component";

@NgModule({
  declarations: [AppConfirmDeleteDialogComponent,FourOFourComponent],
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatIcon
  ],
  exports: [],
})
export class AppSharedModule {
}
