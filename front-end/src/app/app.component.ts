import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-end';
  text: any;
  constructor(private httpClient: HttpClient){
    
  }
  ngOnInit(){
    this.httpClient.get<any>('http://localhost:4201').subscribe(
      (response) => {
        this.text = JSON.stringify(response);
        console.log('got the response');
        console.log(this.text);
      }
    );
  }
}
