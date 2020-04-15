import { EventEmitter } from "@angular/core";
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output
} from "@angular/core";

@Component({
  selector: "app-star-component",
  templateUrl: "./star-component.component.html",
  styleUrls: ["./star-component.component.scss"]
})
export class StarComponentComponent implements OnInit, OnChanges {
  @Input() rating: number;
  @Output() ratingClicked = new EventEmitter<string>();
  starWidth: number;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.starWidth = (this.rating * 75) / 5;
  }

  ngOnInit(): void {}
  onClickRating() {
    this.ratingClicked.emit(`The rating is ${this.rating}`);
  }
}
