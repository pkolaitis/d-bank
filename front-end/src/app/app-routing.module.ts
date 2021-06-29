import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActionsComponent } from './components/actions/actions.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

const routes: Routes = [
  {path : '', component: LandingComponent},
  {path : LandingComponent.key, component: LandingComponent},
  {path : LoginComponent.key, component: LoginComponent},
  {path : RegisterComponent.key, component: RegisterComponent},
  {path : LogoutComponent.key, component: LogoutComponent},
  {path : ProfileComponent.key, component: ProfileComponent},
  {path : ResetPasswordComponent.key, component: ResetPasswordComponent},
  {path : TransactionsComponent.key, component: TransactionsComponent},
  {path : ActionsComponent.key, component: ActionsComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
