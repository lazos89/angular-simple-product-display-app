import { Component, OnInit, OnDestroy } from "@angular/core";
import { IProduct } from "../../core/models/product-list.model";
import { ProductService } from "../product.service";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit, OnDestroy {
  productSubscription: Subscription;
  imageMargin = 2;
  imageWidth = 50;
  showImage = false;
  pageTitle = "Product List";
  errorMessage = "";
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];

  _listFilter = "";
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter
      ? this.performFilter(this.listFilter)
      : this.products;
  }

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.listFilter = this.route.snapshot.queryParamMap.get("filterBy") || "";
    this.showImage =
      this.route.snapshot.queryParamMap.get("showImage") === "true";
    this.productSubscription = this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
        this.filteredProducts = this.performFilter(this.listFilter);
      },
      (error) => (this.errorMessage = error)
    );

    // .subscribe({
    //   next: products => (this.products = products),
    //   error: err => (this.errorMessage = err)
    // });
  }

  onShowClicked() {
    this.showImage = !this.showImage;
  }
  performFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter(
      (product: IProduct) =>
        product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }
  onRatingClicked(message: string) {
    this.pageTitle = "Product List: " + message;
    // console.log(message);
  }
}
