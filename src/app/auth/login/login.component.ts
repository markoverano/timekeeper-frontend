import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.email, this.password).subscribe((res) => {
      if (res) {
        const role = this.authService.getUserRole();
        this.router.navigate(['/home', { outlets: { primary: (role === 'admin' ? 'employees' : 'timein') } }]);
      }
    });
  }
}