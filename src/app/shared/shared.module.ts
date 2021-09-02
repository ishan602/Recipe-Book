import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { Loader } from "./loader.component";

@NgModule({
  declarations: [Loader, AlertComponent, DropdownDirective],
  imports: [CommonModule],
  exports: [Loader, AlertComponent, DropdownDirective, CommonModule],
})
export class SharedModule {}
