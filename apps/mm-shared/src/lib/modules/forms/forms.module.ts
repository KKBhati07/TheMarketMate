import { NgModule } from "@angular/core";
import { LoginFormComponent } from "./component/login-form/login-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { SignupFormComponent } from "./component/signup-form/signup-form.component";
import { FormContainerComponent } from './component/form-container/form-container.component';
import { SharedModule } from '../shared/mm-shared.module';

// import { AppUtilModule } from "../app-util/module/app-util.module";


@NgModule({
	declarations: [
		FormContainerComponent,
		LoginFormComponent,
		SignupFormComponent
	],
	imports: [
		ReactiveFormsModule,
		MatInputModule,
		CommonModule,
		MatIconModule,
		SharedModule,
		// AppUtilModule,
	],
	exports: [LoginFormComponent, SignupFormComponent],
})
export class FormsModule {
}
