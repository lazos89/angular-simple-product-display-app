import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren,
} from "@angular/core";
import {
  NgForm,
  FormGroup,
  Validators,
  FormBuilder,
  FormControlName,
} from "@angular/forms";
import { IProduct } from "../../../core/models/product-list.model";
import { ActivatedRoute } from "@angular/router";
import { NumberValidators } from "../../../shared/validators/number.validator";
import { GenericValidator } from "../../../shared/validators/generic-validator";
import { Observable, merge, fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-product-edit-info",
  templateUrl: "./product-edit-info.component.html",
  styleUrls: ["./product-edit-info.component.scss"],
})
export class ProductEditInfoComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];

  // @ViewChild(FormGroup) productForm: FormGroup;
  productForm: FormGroup;
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  errorMessage: string;
  product: IProduct;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      productName: {
        required: "Product name is required.",
        minlength: "Product name must be at least three characters.",
        maxlength: "Product name cannot exceed 50 characters.",
      },
      productCode: {
        required: "Product code is required.",
      },
      starRating: {
        range: "Rate the product between 1 (lowest) and 5 (highest).",
      },
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.route.parent.data.subscribe((data) => {
      if (this.productForm) {
        this.productForm.reset();
      }

      this.product = data["resolveData"].product;
      this.productForm = this.fb.group({
        productName: [
          this.product.productName,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        productCode: [this.product.productCode, Validators.required],
        starRating: ["", NumberValidators.range(1, 5)],
        description: [this.product.description],
      });
    });
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<
      any
    >[] = this.formInputElements.map((formControl: ElementRef) =>
      fromEvent(formControl.nativeElement, "blur")
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.productForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.productForm
        );
      });
  }

  isInValid(crtl: string) {
    const { dirty, touched, valid } = this.productForm.get(crtl);
    return (dirty || touched || this.product.id !== 0) && !valid;
  }
}
