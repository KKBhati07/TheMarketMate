import {NgModule} from '@angular/core'
import {AppHeaderComponent} from "./component/app-header.component";
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {AppUtilModule} from "../app-util/module/app-util.module";
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations:[AppHeaderComponent],
    imports: [
        CommonModule,
        MatIcon,
        AppUtilModule,
        MatTooltipModule
    ],
  exports: [
    AppHeaderComponent
  ]
})
export class AppHeaderModule{}
