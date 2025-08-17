import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AnnouncementService } from '../../../services/announcement.service';
import { Announcement } from '../../../models/announcement.model';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent {
  announcements: Announcement[] = [];
  events: Announcement[] = [];
  currentUser: any;

  constructor(
    public authService: AuthService,
    private announcementService: AnnouncementService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcementService.getActiveAnnouncements().subscribe({
      next: (allAnnouncements) => {
        // Filter announcements (non-events)
        this.announcements = allAnnouncements.filter(announcement => !announcement.isEvent);
        
        // Filter events
        this.events = allAnnouncements.filter(announcement => announcement.isEvent);
      }
    });
  }

  get isManager(): boolean {
    return this.currentUser?.role === UserRole.MANAGER;
  }

  get isEmployee(): boolean {
    return this.currentUser?.role === UserRole.EMPLOYEE;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatEventDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  deleteAnnouncement(id: number): void {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcementService.deleteAnnouncement(id).subscribe({
        next: (success) => {
          if (success) {
            this.loadAnnouncements();
          }
        }
      });
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'badge bg-danger';
      case 'medium':
        return 'badge bg-warning';
      case 'low':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  }
}
