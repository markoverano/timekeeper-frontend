import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TimeManagementComponent } from './components/time-management/time-management.component';
import { TimeManagementService } from './services/time-management.service';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EmployeesComponent } from './components/employees/employees.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from 'src/app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';
import { TokenService } from './auth/interceptors/token.service';

@NgModule({
  declarations: [
    AppComponent,
    TimeManagementComponent,
    EmployeesComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [AuthGuard, TimeManagementService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
