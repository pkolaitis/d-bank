import { Component, OnInit } from "@angular/core";
import { FooterData, Translations } from "src/app/data/all";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: [],
})
export class FooterComponent implements OnInit {
  texts: any;
  footer: any;
  constructor() {
    this.texts = Translations;
    this.footer = FooterData;
  }

  ngOnInit() { }
}
