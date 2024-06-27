import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './app/auth/auth.guard';
import { LoginComponent } from './app/auth/login/login.component';
import { TimeManagementComponent } from './app/components/time-management/time-management.component';
import { EmployeesComponent } from './app/components/employees/employees.component';
import { HomeComponent } from './app/components/home/home.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
      path: 'home', 
      component: HomeComponent,
      canActivate: [AuthGuard],
      children: [
        { path: '', redirectTo: 'timein', pathMatch: 'full' },
        { path: 'timein', component: TimeManagementComponent },
        { path: 'employees', component: EmployeesComponent, canActivate: ['admin'] }
      ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
