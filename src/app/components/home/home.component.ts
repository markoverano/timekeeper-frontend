import { Component } from '@angular/core';
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

  constructor(private authService: AuthService) {
    this.isAdmin = this.authService.isAdmin();
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  logout() {
    this.authService.logout();
  }
}
