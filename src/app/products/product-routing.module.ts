import { Routes, RouterModule } from "@angular/router";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { ProductDetailGuard } from "./product-detail.guard";
import { NgModule } from "@angular/core";
import { ProductEditComponent } from "./product-edit/product-edit.component";
import { ProductResolver } from "./product-resolver.service";
import { ProductEditInfoComponent } from "./product-edit/product-edit-info/product-edit-info.component";
import { ProductEditTagsComponent } from "./product-edit/product-edit-tags/product-edit-tags.component";
import { AuthGuard } from "../auth/auth.guard";
import { ProductEditGuard } from "./product-edit/product-edit.guard";

export const routes: Routes = [
  {
    path: "",
    component: ProductListComponent,
  },
  {
    path: ":id",
    canActivate: [ProductDetailGuard],
    component: ProductDetailsComponent,
    resolve: { resolveData: ProductResolver },
  },
  {
    path: ":id/edit",
    canActivate: [ProductDetailGuard],
    canDeactivate: [ProductEditGuard],
    component: ProductEditComponent,
    resolve: { resolveData: ProductResolver },
    children: [
      { path: "", pathMatch: "full", redirectTo: "info" },
      { path: "info", component: ProductEditInfoComponent },
      { path: "tags", component: ProductEditTagsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
