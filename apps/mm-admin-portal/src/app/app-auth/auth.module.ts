import { NgModule } from '@angular/core';
import { FormsModule } from '@marketmate/shared';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { authRoutes } from './auth.routes';

@NgModule({
	imports:[
		FormsModule,
		CommonModule,
		RouterModule.forChild(authRoutes),

	]
})
export class AuthModule {

}