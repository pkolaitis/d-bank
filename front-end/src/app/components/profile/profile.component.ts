import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  static key = 'profile';
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userData.subscribe(x => console.log(this.user = x));
  }

}
