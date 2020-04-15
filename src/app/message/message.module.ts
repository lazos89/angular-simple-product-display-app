import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessageComponent } from "./message.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [MessageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "messages",
        component: MessageComponent,
        outlet: "popup",
      },
    ]),
  ],
})
export class MessageModule {}
