import { Injectable } from "@angular/core";
import { User } from "./user";
import { Router } from "@angular/router";
import { MessageService } from "../message/message.service";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  currentUser: User;
  redirectUrl: string;
  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  // constructor(private messageService: MessageService) { }
  constructor(private route: Router, private messageService: MessageService) {}

  login(userName: string, password: string): void {
    if (!userName || !password) {
      this.messageService.addMessage("Please enter your userName and password");
      return;
    }
    if (userName === "admin") {
      this.currentUser = {
        id: 1,
        userName: userName,
        isAdmin: true,
      };
      this.messageService.addMessage("Admin login");
      return;
    }
    this.currentUser = {
      id: 2,
      userName: userName,
      isAdmin: false,
    };

    this.messageService.addMessage(
      `User: ${this.currentUser.userName} logged in`
    );
  }

  logout(): void {
    this.currentUser = null;
  }
}
