import {NgModule} from "@angular/core";
import {AppRootComponent} from "./components/app-root.component";
import {HomeComponent} from "./components/home-component/home.component";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [AppRootComponent,HomeComponent],
  imports: [CommonModule, MatIconModule]
})
export class AppRootModule {}
