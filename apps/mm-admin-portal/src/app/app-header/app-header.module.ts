import { NgModule } from '@angular/core'
import { AppHeaderComponent } from "./component/app-header.component";
import { CommonModule } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppHeaderMenuComponent } from './component/app-header-menu/app-header-menu.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'mm-shared';


@NgModule({
	declarations: [
		AppHeaderComponent,
		AppHeaderMenuComponent,
	],
	imports: [
		CommonModule,
		MatIcon,
		MatTooltipModule,
		RouterModule,
		SharedModule
	],
	exports: [
		AppHeaderComponent,
		AppHeaderMenuComponent,
	]
})
export class AppHeaderModule{}
