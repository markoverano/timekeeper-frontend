import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isAdmin: boolean = false;
  showTimeManagement: boolean = true;
  showEmployeeManagement: boolean = false;
  selectedTab: string = 'time';

  constructor(private authService: AuthService, private router: Router) {
    this.isAdmin = false;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
