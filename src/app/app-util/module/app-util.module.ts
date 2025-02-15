import {NgModule} from "@angular/core";
import {AppButtonComponent} from "./component/app-button/app-button.component";
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {BottomSheetPillComponent} from "./component/bottomsheet-pill/bottomsheet-pill.component";
import {ProductCategoryComponent} from "./component/product-category/product-category.component";

@NgModule({
  declarations: [AppButtonComponent,BottomSheetPillComponent,ProductCategoryComponent],
  exports: [
    AppButtonComponent,
    BottomSheetPillComponent,
    ProductCategoryComponent
  ],
  imports: [CommonModule, MatIcon]
})
export class AppUtilModule {}
