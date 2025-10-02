import {NgModule} from '@angular/core'
import {AppHeaderComponent} from "./component/app-header.component";
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {AppUtilModule} from "../app-util/module/app-util.module";
import {MatTooltipModule} from '@angular/material/tooltip';
import {AppHeaderMenuComponent} from './component/app-header-menu/app-header-menu.component';


@NgModule({
  declarations:[AppHeaderComponent, AppHeaderMenuComponent],
    imports: [
        CommonModule,
        MatIcon,
        AppUtilModule,
        MatTooltipModule
    ],
  exports: [
    AppHeaderComponent,
      AppHeaderMenuComponent
  ]
})
export class AppHeaderModule{}
