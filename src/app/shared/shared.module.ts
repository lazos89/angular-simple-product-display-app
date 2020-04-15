import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StarComponentComponent } from "./star-component/star-component.component";
import { FormsModule } from "@angular/forms";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [StarComponentComponent, PageNotFoundComponent],
  imports: [CommonModule],
  exports: [CommonModule, FormsModule, StarComponentComponent]
})
export class SharedModule {}
