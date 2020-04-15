import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { IProduct } from "../../../core/models/product-list.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-product-edit-info",
  templateUrl: "./product-edit-info.component.html",
  styleUrls: ["./product-edit-info.component.scss"],
})
export class ProductEditInfoComponent implements OnInit {
  @ViewChild(NgForm) productForm: NgForm;

  errorMessage: string;
  product: IProduct;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent.data.subscribe((data) => {
      if (this.productForm) {
        this.productForm.reset();
      }

      this.product = data["resolveData"].product;
    });
  }
}
