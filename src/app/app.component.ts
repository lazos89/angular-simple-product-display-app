import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
} from "@angular/router";
import { slideInAnimation } from "./app.animation";
import { MessageService } from "./message/message.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  loading = true;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isMessageDisplayed(): boolean {
    return this.messageService.isDisplayed;
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return "";
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    public messageService: MessageService
  ) {
    router.events.subscribe((routerEvent) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  checkRouterEvent(routerEvent: Event) {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.loading = false;
    }
  }
  ngOnInit(): void {}

  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl("welcome");
  }

  displayMessages() {
    this.router.navigate([{ outlets: { popup: ["messages"] } }]);
    this.messageService.isDisplayed = true;
  }
  hideMessages() {
    this.router.navigate([{ outlets: { popup: null } }]);

    this.messageService.isDisplayed = false;
  }
}
