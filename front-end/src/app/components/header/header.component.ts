import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Translations } from "src/app/data/all";
import { AuthService } from "src/app/services/auth-service.service";
import { LandingComponent } from "../landing/landing.component";
import { LoginComponent } from "../login/login.component";
import { LogoutComponent } from "../logout/logout.component";
import { ProfileComponent } from "../profile/profile.component";
import { ScenariosComponent } from "../scenarios/scenarios.component";
import { StatisticsComponent } from "../statistics/statistics.component";
import { TransactionsComponent } from "../transactions/transactions.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  texts: any;
  menuLinks: Array<any>;
  isLoggedIn: boolean;
  isAdmin: boolean;

  constructor(private location: Location, private authService: AuthService) {
    this.texts = Translations;
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.menuLinks = [
      { id: 'home', selected: false, availableUrls: ['', '/',`/${LandingComponent.key}`] },
      { id: 'login', selected: false, availableUrls: [`/${LoginComponent.key}`], showOnlyGuest: true },
      { id: 'logout', selected: false, availableUrls: [`/${LogoutComponent.key}`], showOnlyAuth: true },
      { id: 'transactions', selected: false, availableUrls: [`/${TransactionsComponent.key}`], showOnlyAuth: true  },
      { id: 'scenarios', selected: false, availableUrls: [`/${ScenariosComponent.key}`], showOnlyAdmin: true },
      { id: 'statistics', selected: false, availableUrls: [`/${StatisticsComponent.key}`], showOnlyAuth: true },
    ];
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
    this.authService.getUser();
    this.menuLinks.map(x => {
      x.title = this.texts.menuLinks[x.id];
      x.isSelected = x.availableUrls.indexOf(this.location.path()) > -1;
    });
  }

  refreshSelectedLink(menulink: any) {
    this.menuLinks.map(x => {
      x.isSelected = x.id === menulink.id;
    });
  }

  getMenuLinks(){
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
    return this.menuLinks.filter(x => (!x.showOnlyAdmin || this.isAdmin ) && (!x.showOnlyAuth || this.isLoggedIn ) && (!x.showOnlyGuest || !this.isLoggedIn));
  }
  refresh(){
    window.location.reload();
  }

}
