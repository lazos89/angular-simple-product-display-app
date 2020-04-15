import { Injectable } from "@angular/core";

import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { IProduct, IProductResolved } from "../core/models/product-list.model";
import { Observable, of } from "rxjs";
import { ProductService } from "./product.service";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProductResolver implements Resolve<IProductResolved> {
  constructor(private productService: ProductService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IProductResolved> {
    const id = +route.paramMap.get("id");
    if (isNaN(id)) {
      const message = `Product id was not found a number: ${id}`;
      console.log(message);
      return of({ product: null, error: message });
    }
    return this.productService.getProduct(id).pipe(
      map((product) => ({
        product: product,
      })),
      catchError((err) => {
        const message = `Retrieval error: ${err}`;
        console.log(message);
        return of({ product: null, error: message });
      })
    );
  }
}
