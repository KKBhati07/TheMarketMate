import { NgModule } from "@angular/core";
import { FormsModule } from "../login-form/forms.module";
import { FormContainerComponent } from "./form-container/form-container.component";
import { AppHeaderModule } from "../app-header/app-header.module";
import { CommonModule } from "@angular/common";

@NgModule({
	declarations: [FormContainerComponent],
	imports: [FormsModule, AppHeaderModule, CommonModule,],
	exports: []
})
export class FormsContainerModule {
}
