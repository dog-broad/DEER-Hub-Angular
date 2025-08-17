import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isSidebarOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    // You can emit an event here to communicate with parent component
  }

  get isManager(): boolean {
    return this.authService.getCurrentUser()?.role === UserRole.MANAGER;
  }

  get isEmployee(): boolean {
    return this.authService.getCurrentUser()?.role === UserRole.EMPLOYEE;
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
