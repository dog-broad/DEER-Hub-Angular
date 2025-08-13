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
  pendingLeavesCount = 0;
  totalDocumentsCount = 0;
  activeAnnouncementsCount = 0;

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService,
    private documentService: DocumentService,
    private announcementService: AnnouncementService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  async ngOnInit(): Promise<void> {
    await this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    if (this.currentUser) {
      try {
        // Load user's recent leaves
        const leaves = await this.leaveService.getLeavesByUser(this.currentUser.id);
        this.recentLeaves = leaves.slice(0, 5); // Get last 5 leaves
        this.pendingLeavesCount = leaves.filter(leave => leave.status === LeaveStatus.PENDING).length;

        // Load recent documents
        const documents = this.isManager 
          ? await this.documentService.getAllDocuments() 
          : await this.documentService.getPublicDocuments();
        this.recentDocuments = documents.slice(0, 5);
        this.totalDocumentsCount = documents.length;

        // Load recent announcements
        const announcements = await this.announcementService.getActiveAnnouncements();
        this.recentAnnouncements = announcements.slice(0, 5);
        this.activeAnnouncementsCount = announcements.length;
      } catch (error) {
        console.error('Error loading dashboard data', error);
      }
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
}

