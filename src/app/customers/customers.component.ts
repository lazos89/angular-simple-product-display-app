import { Component, OnInit } from "@angular/core";

import { Customer } from "./customer";
import { FormBuilder, FormGroup } from "@angular/forms";

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
      firstName: "",
      lastName: "",
      email: "",
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
}
