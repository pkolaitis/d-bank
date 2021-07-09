import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ScenariosComponent } from './components/scenarios/scenarios.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    LogoutComponent,
    ProfileComponent,
    TransactionsComponent,
    HeaderComponent,
    FooterComponent,
    ScenariosComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
