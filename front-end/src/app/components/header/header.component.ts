import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Translations } from "src/app/data/all";
import { ActionsComponent } from "../actions/actions.component";
import { LandingComponent } from "../landing/landing.component";
import { LoginComponent } from "../login/login.component";
import { ProfileComponent } from "../profile/profile.component";
import { RegisterComponent } from "../register/register.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";
import { TransactionsComponent } from "../transactions/transactions.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  texts: any;
  menuLinks: Array<any>;

  constructor(private location: Location) {
    this.texts = Translations;
    this.menuLinks = [
      { id: 'home', selected: false, availableUrls: ['', '/',`/${LandingComponent.key}`] },
      { id: 'login', selected: false, availableUrls: [`/${LoginComponent.key}`] },
      { id: 'register', selected: false, availableUrls: [`/${RegisterComponent.key}`] },
      { id: 'profile', selected: false, availableUrls: [`/${ProfileComponent.key}`] },
      { id: 'reset', selected: false, availableUrls: [`/${ResetPasswordComponent.key}`] },
      { id: 'transactions', selected: false, availableUrls: [`/${TransactionsComponent.key}`] },
      { id: 'actions', selected: false, availableUrls: [`/${ActionsComponent.key}`] }
    ];
  }

  ngOnInit() {
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


}
