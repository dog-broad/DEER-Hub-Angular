import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuCollapsed = true;

  constructor(public authService: AuthService) {
    console.log(this.authService.isLoggedIn());
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  isLoggedIn(): boolean {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      console.log(isLoggedIn);
      return isLoggedIn;
    });
    return false;
  }

  getCurrentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}

