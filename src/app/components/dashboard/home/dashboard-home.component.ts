import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LeaveService } from '../../../services/leave.service';
import { DocumentService } from '../../../services/document.service';
import { AnnouncementService } from '../../../services/announcement.service';
import { Leave, LeaveStatus } from '../../../models/leave.model';
import { Document } from '../../../models/document.model';
import { Announcement } from '../../../models/announcement.model';

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
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    if (this.currentUser) {
      // Load user's recent leaves
      const leaves = this.leaveService.getLeavesByUser(this.currentUser.id);
      this.recentLeaves = leaves.slice(0, 5); // Get last 5 leaves
      this.pendingLeavesCount = leaves.filter(leave => leave.status === LeaveStatus.PENDING).length;

      // Load recent documents
      if (this.authService.isManager()) {
        const documents = this.documentService.getAllDocuments();
        this.recentDocuments = documents.slice(0, 5);
        this.totalDocumentsCount = documents.length;
      } else {
        const documents = this.documentService.getPublicDocuments();
        this.recentDocuments = documents.slice(0, 5);
        this.totalDocumentsCount = documents.length;
      }

      // Load recent announcements (non-events)
      const allAnnouncements = this.announcementService.getActiveAnnouncements();
      this.recentAnnouncements = allAnnouncements
        .filter(announcement => !announcement.isEvent)
        .slice(0, 4);
      this.activeAnnouncementsCount = allAnnouncements.filter(announcement => !announcement.isEvent).length;

      // Load recent events
      this.recentEvents = this.announcementService.getUpcomingEvents().slice(0, 4);
      this.upcomingEventsCount = this.announcementService.getUpcomingEvents().length;
    }
  }

  get isManager(): boolean {
    return this.authService.isManager();
  }

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }

  getStatusBadgeClass(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.APPROVED:
        return 'badge bg-success';
      case LeaveStatus.REJECTED:
        return 'badge bg-danger';
      case LeaveStatus.PENDING:
        return 'badge bg-warning';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.APPROVED:
        return 'Approved';
      case LeaveStatus.REJECTED:
        return 'Rejected';
      case LeaveStatus.PENDING:
        return 'Pending';
      default:
        return 'Unknown';
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

