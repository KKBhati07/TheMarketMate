import { NgModule } from '@angular/core'
import { AppHeaderComponent } from "./component/app-header.component";
import { CommonModule } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { AppUtilModule } from "../app-util/module/app-util.module";
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppHeaderMenuComponent } from './component/app-header-menu/app-header-menu.component';
import { HeaderUserMenuComponent } from './component/header-user-menu/header-user-menu.component';
import { UserMenuNavComponent } from './component/app-user-menu-nav/app-user-menu-nav.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'mm-shared';


@NgModule({
	declarations: [
		AppHeaderComponent,
		AppHeaderMenuComponent,
		HeaderUserMenuComponent,
		UserMenuNavComponent
	],
	imports: [
		CommonModule,
		MatIcon,
		AppUtilModule,
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
