import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.less']
})
export class LogoutComponent implements OnInit {
  static key = 'logout';
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.logout();
    setTimeout(function(){window.location.href = '/'},1500);
  }

}
