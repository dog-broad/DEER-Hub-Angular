import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LeaveService } from '../../../services/leave.service';
import { DocumentService } from '../../../services/document.service';
import { AnnouncementService } from '../../../services/announcement.service';
import { Leave, LeaveStatus } from '../../../models/leave.model';
import { Document } from '../../../models/document.model';
import { Announcement } from '../../../models/announcement.model';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  currentUser: any;
  recentLeaves: Leave[] = [];
  recentDocuments: Document[] = [];
  recentAnnouncements: Announcement[] = [];
  recentEvents: Announcement[] = [];
  pendingLeavesCount = 0;
  totalDocumentsCount = 0;
  activeAnnouncementsCount = 0;
  upcomingEventsCount = 0;

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService,
    private documentService: DocumentService,
    private announcementService: AnnouncementService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (this.currentUser) {
      this.leaveService.getLeavesByUser(this.currentUser.id).subscribe({
        next: (leaves) => {
          console.log(leaves);
          this.recentLeaves = leaves.slice(0, 5);
          this.pendingLeavesCount = leaves.filter(leave => leave.status === LeaveStatus.PENDING).length;
        }
      });

      if (this.currentUser?.role === UserRole.MANAGER) {
        this.documentService.getAllDocuments().subscribe({
          next: (documents) => {
            this.recentDocuments = documents.slice(0, 5);
            this.totalDocumentsCount = documents.length;
          }
        });
      } else {
        this.documentService.getPublicDocuments().subscribe({
          next: (documents) => {
            this.recentDocuments = documents.slice(0, 5);
            this.totalDocumentsCount = documents.length;
          }
        });
      }

      this.announcementService.getActiveAnnouncements().subscribe({
        next: (allAnnouncements) => {
          this.recentAnnouncements = allAnnouncements
            .filter(announcement => !announcement.isEvent)
            .slice(0, 4);
          this.activeAnnouncementsCount = allAnnouncements.filter(announcement => !announcement.isEvent).length;
        }
      });

      this.announcementService.getUpcomingEvents().subscribe({
        next: (events) => {
          this.recentEvents = events.slice(0, 4);
          this.upcomingEventsCount = events.length;
        }
      });
    }
  }

  get isManager(): boolean {
    return this.currentUser?.role === UserRole.MANAGER;
  }

  get isEmployee(): boolean {
    return this.currentUser?.role === UserRole.EMPLOYEE;
  }

  getStatusBadgeClass(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.APPROVED: return 'badge bg-success';
      case LeaveStatus.REJECTED: return 'badge bg-danger';
      case LeaveStatus.PENDING: return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }

  getStatusText(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.APPROVED: return 'Approved';
      case LeaveStatus.REJECTED: return 'Rejected';
      case LeaveStatus.PENDING: return 'Pending';
      default: return 'Unknown';
    }
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
}

