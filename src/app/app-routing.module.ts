import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from "@angular/router";
import { WelcomeComponent } from "./home/welcome.component";
import { PageNotFoundComponent } from "./shared/page-not-found/page-not-found.component";
import { AuthGuard } from "./auth/auth.guard";
import { SelectiveStrategy } from "./selective-strategy.service";

const routes: Routes = [
  { path: "welcome", component: WelcomeComponent },
  {
    path: "products",
    // canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: { preload: true },
    loadChildren: () =>
      import("./products/products.module").then((m) => m.ProductsModule),
  },
  { path: "", pathMatch: "full", redirectTo: "welcome" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: SelectiveStrategy }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
