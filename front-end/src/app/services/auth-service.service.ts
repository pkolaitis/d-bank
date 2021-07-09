import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  text: string;
  userData: BehaviorSubject<any>;
  constructor(private httpClient: HttpClient){ 
    this.text = '';
    this.userData = new BehaviorSubject({});
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  isAdmin(): boolean {
    return !!this.userData['_value'].isAdmin;
  }

  setToken(token: string){
    sessionStorage.setItem('x-token', token);
  }

  getUser(){
    this.httpClient.get<any>('http://localhost:4201/getUser', {}).pipe().subscribe(x => this.userData.next(x));
  }

  getToken(){
    return sessionStorage.getItem('x-token');
  }
  logout(){
    this.removeToken();
  }
  removeToken(){
    sessionStorage.removeItem('x-token');
  }
  login(username: string ='', password: string =''){
    return this.httpClient.post<any>(
        'http://localhost:4201/login',{}, 
        {
          headers: {
            username, 
            password
          }
        }
      );
  }
}
