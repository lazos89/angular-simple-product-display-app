import { Component, OnInit } from "@angular/core";
import {
  IProduct,
  IProductResolved,
} from "../../core/models/product-list.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../product.service";

@Component({
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
})
export class ProductDetailsComponent implements OnInit {
  pageTitle: string;
  product: IProduct;
  errorMessage: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prodcutService: ProductService
  ) {}

  ngOnInit(): void {
    const resolveData: IProductResolved = this.route.snapshot.data[
      "resolveData"
    ];
    this.errorMessage = resolveData.error;
    this.onProductRetrieved(resolveData.product);
    console.log(resolveData);

    // let id = +this.route.snapshot.paramMap.get("id");
    // this.pageTitle = `Product ${id} Details`;
    // this.getProduct(id);

    // this.product = {
    //   id: id,
    //   productName: "Leaf Rake",
    //   productCode: "GDN-0011",
    //   releaseDate: "March 19, 2019",
    //   description: "Leaf rake with 48-inch wooden handle.",
    //   price: 19.95,
    //   starRating: 3.2,
    //   imageUrl: "assets/images/leaf_rake.png",
    // };
  }

  getProduct(id: number) {
    this.prodcutService.getProduct(id).subscribe(
      (product) => {
        this.onProductRetrieved(product);
      },
      (err) => {
        console.log(`Error , ${err}`);
      }
    );
  }

  onProductRetrieved(product: IProduct): void {
    this.product = product;

    if (this.product) {
      this.pageTitle = `Product Detail: ${this.product.productName}`;
    } else {
      this.pageTitle = "No product found";
    }
  }
  onBack() {
    this.router.navigate(["/products"], { queryParamsHandling: "preserve" });
  }
}
