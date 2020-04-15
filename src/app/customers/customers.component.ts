import { Component, OnInit } from "@angular/core";

import { Customer } from "./customer";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
} from "@angular/forms";
import { debounceTime } from "rxjs/operators";

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
  emailMessage: string;
  private validationMessage = {
    required: "Please enter your email address.",
    valid: "Please enter a valid email address.",
  };
  constructor(private fb: FormBuilder) {}

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get("addresses");
  }
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
      addresses: this.fb.array([this.buildAddresses()]),
    });

    this.customerForm
      .get("notification")
      .valueChanges.subscribe((value) => this.setNoticifation(value));
    const emailControl = this.customerForm.get("emailGroup.email");
    emailControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((value) => this.setMessage(emailControl));
  }

  buildAddresses(): FormGroup {
    return this.fb.group({
      addressType: "home",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
    });
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
    if (value === "text") {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  setMessage(c: AbstractControl) {
    this.emailMessage = " ";
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors)
        .map((key) => this.validationMessage[key])
        .join(" ");
    }
  }

  isInValid(crtl: string) {
    const { dirty, touched, valid } = this.customerForm.get(crtl);
    return (dirty || touched) && !valid;
  }

  addAddress() {
    this.addresses.push(this.buildAddresses());
  }
}
