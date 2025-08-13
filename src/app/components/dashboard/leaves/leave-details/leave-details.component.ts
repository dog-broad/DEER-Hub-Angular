import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { LeaveService } from '../../../../services/leave.service';
import { Leave, LeaveStatus, LeaveType } from '../../../../models/leave.model';

@Component({
  selector: 'app-leave-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './leave-details.component.html',
  styleUrl: './leave-details.component.css'
})
export class LeaveDetailsComponent {
  leave: Leave | undefined;
  currentUser: any;
  approvalComment: string = '';

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLeaveDetails();
  }

  loadLeaveDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.leave = this.leaveService.getLeaveById(+id);
      if (!this.leave) {
        this.router.navigate(['/dashboard/leaves']);
      }
    }
  }

  approveLeave(): void {
    if (this.leave && this.approvalComment.trim()) {
      this.leaveService.updateLeaveStatus(
        this.leave.id, 
        LeaveStatus.APPROVED, 
        this.currentUser.id, 
        this.approvalComment
      );
      this.router.navigate(['/dashboard/leaves']);
    } else {
      alert('Please provide a comment for approval.');
    }
  }

  rejectLeave(): void {
    if (this.leave && this.approvalComment.trim()) {
      this.leaveService.updateLeaveStatus(
        this.leave.id, 
        LeaveStatus.REJECTED, 
        this.currentUser.id, 
        this.approvalComment
      );
      this.router.navigate(['/dashboard/leaves']);
    } else {
      alert('Please provide a comment for rejection.');
    }
  }

  canApproveReject(): boolean {
    return this.isManager && 
           this.leave?.status === LeaveStatus.PENDING;
  }

  canView(): boolean {
    return !!(this.leave && (
      this.isManager || 
      this.leave.userId === this.currentUser.id
    ));
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusBadgeClass(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.PENDING:
        return 'badge bg-warning';
      case LeaveStatus.APPROVED:
        return 'badge bg-success';
      case LeaveStatus.REJECTED:
        return 'badge bg-danger';
      case LeaveStatus.CANCELLED:
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.PENDING:
        return 'Pending';
      case LeaveStatus.APPROVED:
        return 'Approved';
      case LeaveStatus.REJECTED:
        return 'Rejected';
      case LeaveStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  getLeaveTypeText(type: LeaveType): string {
    switch (type) {
      case LeaveType.SICK:
        return 'Sick Leave';
      case LeaveType.VACATION:
        return 'Vacation Leave';
      case LeaveType.PERSONAL:
        return 'Personal Leave';
      case LeaveType.MATERNITY:
        return 'Maternity Leave';
      case LeaveType.PATERNITY:
        return 'Paternity Leave';
      case LeaveType.OTHER:
        return 'Other Leave';
      default:
        return 'Unknown';
    }
  }

  getLeaveTypeBadgeClass(type: LeaveType): string {
    switch (type) {
      case LeaveType.SICK:
        return 'badge bg-danger';
      case LeaveType.VACATION:
        return 'badge bg-info';
      case LeaveType.PERSONAL:
        return 'badge bg-primary';
      case LeaveType.MATERNITY:
        return 'badge bg-purple';
      case LeaveType.PATERNITY:
        return 'badge bg-purple';
      case LeaveType.OTHER:
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  }

  calculateDays(): number {
    if (this.leave) {
      const start = new Date(this.leave.startDate);
      const end = new Date(this.leave.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1; // Include both start and end dates
    }
    return 0;
  }

  getNameByUserId(userId: number): string {
    const user = this.authService.getUserById(userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }

  get isManager(): boolean {
    return this.authService.isManager();
  }

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }
}
