import { Component, OnInit } from "@angular/core";

import { Customer } from "./customer";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get("email");
  const confirmEmailControl = c.get("confirmEmail");

  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }
  if (emailControl.value === confirmEmailControl.value) {
    return null;
  }
  return { match: true };
}
function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (
      (c.value !== null && isNaN(c.value)) ||
      c.value < min ||
      c.value > max
    ) {
      return { range: true };
    }
    return null;
  };
}

@Component({
  selector: "app-customer",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
  customer = new Customer();
  customerForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group(
        {
          email: ["", [Validators.required, Validators.email]],
          confirmEmail: ["", [Validators.required]],
        },
        { validators: emailMatcher }
      ),
      phone: "",
      notification: "email",
      rating: [null, ratingRange(1, 5)],
      sendCatalog: true,
    });
    console.log(this.customerForm);
  }

  save() {
    console.log(this.customerForm);
    console.log("Saved: " + JSON.stringify(this.customerForm));
  }
  populateTestData() {
    // this.customerForm.setValue({
    //   firstName: "Lazos",
    //   lastName: "Doug",
    //   email: "lazos@test.com",
    //   sendCatalog: true,
    // });
    this.customerForm.patchValue({
      firstName: "Lazos",
      lastName: "Doug",
      sendCatalog: true,
    });
  }

  setNoticifation(value: string) {
    const phoneControl = this.customerForm.get("phone");
    console.log(phoneControl);
    if (value === "text") {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
}
