import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(public authService: AuthService, private router: Router) {}

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
