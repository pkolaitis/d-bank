import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ScenariosComponent } from './components/scenarios/scenarios.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

const routes: Routes = [
  {path : '', component: LandingComponent},
  {path : LandingComponent.key, component: LandingComponent},
  {path : LoginComponent.key, component: LoginComponent},
  {path : LogoutComponent.key, component: LogoutComponent},
  {path : ProfileComponent.key, component: ProfileComponent},
  {path : TransactionsComponent.key, component: TransactionsComponent},
  {path : ScenariosComponent.key, component: ScenariosComponent},
  {path : StatisticsComponent.key, component: StatisticsComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
