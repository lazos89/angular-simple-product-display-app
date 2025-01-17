import { Component, OnInit } from "@angular/core";
import { ProductService } from "../product.service";
import {
  IProduct,
  IProductResolved,
} from "../../core/models/product-list.model";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../../message/message.service";

@Component({
  selector: "app-product-edit",
  templateUrl: "./product-edit.component.html",
  styleUrls: ["./product-edit.component.scss"],
})
export class ProductEditComponent implements OnInit {
  pageTitle = "Product Edit";
  errorMessage: string;

  private currentProduct: IProduct;
  private originalProduct: IProduct;

  get product(): IProduct {
    return this.currentProduct;
  }
  set product(value: IProduct) {
    this.currentProduct = value;
    this.originalProduct = { ...value };
  }

  get isDirty(): boolean {
    return (
      JSON.stringify(this.originalProduct) !==
      JSON.stringify(this.currentProduct)
    );
  }
  private dataIsValid: { [key: string]: boolean };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.log(data);

      const resolveData: IProductResolved = data["resolveData"];
      this.errorMessage = resolveData.error;
      this.onProductRetrieved(resolveData.product);
    });
  }

  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => this.onProductRetrieved(product),
      error: (err) => (this.errorMessage = err),
    });
  }

  isValid(path?: string): boolean {
    this.validate();
    if (path) {
      return this.dataIsValid[path];
    }
    return (
      this.dataIsValid &&
      Object.keys(this.dataIsValid).every((d) => this.dataIsValid[d] === true)
    );
  }
  onProductRetrieved(product: IProduct): void {
    this.product = product;
    console.log(this.product);
    if (!this.product) {
      this.pageTitle = "No product found";
    } else {
      if (this.product.id === 0) {
        this.pageTitle = "Add Product";
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () =>
            this.onSaveComplete(`${this.product.productName} was deleted`),
          error: (err) => (this.errorMessage = err),
        });
      }
    }
  }

  reset() {
    this.dataIsValid = null;
    this.currentProduct = null;
    this.originalProduct = null;
  }

  saveProduct(): void {
    if (this.isValid()) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () =>
            this.onSaveComplete(
              `The new ${this.product.productName} was saved`
            ),
          error: (err) => (this.errorMessage = err),
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () =>
            this.onSaveComplete(
              `The updated ${this.product.productName} was saved`
            ),
          error: (err) => (this.errorMessage = err),
        });
      }
    } else {
      this.errorMessage = "Please correct the validation errors.";
    }
  }

  onSaveComplete(message?: string): void {
    this.reset();
    if (message) {
      this.messageService.addMessage(message);
    }

    // Navigate back to the product list
    this.router.navigate(["/products"]);
  }

  validate(): void {
    // Clear the validation object
    this.dataIsValid = {};

    // 'info' tab
    if (
      this.product.productName &&
      this.product.productName.length >= 3 &&
      this.product.productCode
    ) {
      this.dataIsValid["info"] = true;
    } else {
      this.dataIsValid["info"] = false;
    }

    // 'tags' tab
    if (this.product.category && this.product.category.length >= 3) {
      this.dataIsValid["tags"] = true;
    } else {
      this.dataIsValid["tags"] = false;
    }
  }
}
