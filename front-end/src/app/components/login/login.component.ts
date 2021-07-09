import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  static key = 'login';
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  genericError: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
    ) {
      this.genericError = "";
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      }); 
    }

  ngOnInit() {
    
  }

  // convenience getter for easy access to form fields
  // @ts-ignore
  get f() { return this.loginForm?.controls; }

  onSubmit() {
      this.submitted = true;
      if (this.loginForm.invalid) {
        return;
      }
      this.loading = true;
      this.authService.login(this.f.username.value, this.f.password.value).subscribe(
        (response) => {
          if(response.code === "LOGIN"){
            this.genericError = "";
            this.authService.setToken(response.token);
            window.location.href = '/';
          }else{
            this.authService.logout();
            this.genericError = "There seems to be a problem on login. Please contact admin";
          }
          console.log(this.genericError);
          this.loading = false;
        }
      );;
    
  }
}
