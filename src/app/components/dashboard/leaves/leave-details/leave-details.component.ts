import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { LeaveService } from '../../../../services/leave.service';
import { Leave, LeaveStatus, LeaveType } from '../../../../models/leave.model';
import { UserRole } from '../../../../models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leave-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.css']
})
export class LeaveDetailsComponent implements OnInit {
  leave: Leave | undefined;
  currentUser: any;
  approvalComment: string = '';

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLeaveDetails();
  }

  loadLeaveDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.leaveService.getLeaveById(+id).subscribe({
        next: (leave) => {
          this.leave = leave;
          console.log("Current User after loadLeaveDetails", this.currentUser);
          console.log("Leave", this.leave);
          console.log("Can View", this.canView());
          console.log("Can Edit", this.canEdit());
          console.log("Can Delete", this.canDelete());
          console.log("Can Approve Reject", this.canApproveReject());
          if (!this.leave || !this.canView()) {
            this.router.navigate(['/dashboard/leaves']);
          }
        }
      });
    }
  }

  canView(): boolean {
    console.log("Comparing", this.leave?.userId, this.currentUser.id);
    return this.leave !== undefined && (
      this.isManager || 
      this.leave.userId === this.currentUser.id
    );
  }

  canEdit(): boolean {
    return this.leave !== undefined && (
      this.isManager || 
      (this.leave.userId === this.currentUser.id && this.leave.status === LeaveStatus.PENDING)
    );
  }

  canDelete(): boolean {
    return this.leave !== undefined && (
      this.isManager || 
      (this.leave.userId === this.currentUser.id && this.leave.status === LeaveStatus.PENDING)
    );
  }

  canApproveReject(): boolean {
    return this.leave !== undefined && 
           this.isManager && 
           this.leave.status === LeaveStatus.PENDING;
  }

  approveLeave(): void {
    if (this.leave && this.approvalComment.trim()) {
      this.leaveService.updateLeaveStatus(this.leave.id, LeaveStatus.APPROVED, Number(this.currentUser.id), this.approvalComment).subscribe({
        next: (result) => {
          if (result) {
            this.approvalComment = '';
            this.loadLeaveDetails();
          }
        }
      });
    } else if (!this.approvalComment.trim()) {
      alert('Please enter a comment before approving the leave request.');
    }
  }

  rejectLeave(): void {
    if (this.leave && this.approvalComment.trim()) {
      this.leaveService.updateLeaveStatus(this.leave.id, LeaveStatus.REJECTED, this.currentUser.id, this.approvalComment).subscribe({
        next: (result) => {
          if (result) {
            this.approvalComment = '';
            this.loadLeaveDetails();
          }
        }
      });
    } else if (!this.approvalComment.trim()) {
      alert('Please enter a comment before rejecting the leave request.');
    }
  }

  cancelLeave(): void {
    if (this.leave && confirm('Are you sure you want to cancel this leave request?')) {
      this.leaveService.updateLeaveStatus(this.leave.id, LeaveStatus.CANCELLED, this.currentUser.id).subscribe({
        next: (result) => {
          if (result) {
            this.loadLeaveDetails();
          }
        }
      });
    }
  }

  deleteLeave(): void {
    if (this.leave && confirm('Are you sure you want to delete this leave request?')) {
      this.leaveService.deleteLeave(this.leave.id).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/dashboard/leaves']);
          }
        }
      });
    }
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
    this.authService.getUserById(userId).subscribe({
      next: (user) => {
        if (user) {
          return `${user.firstName} ${user.lastName}`;
        }
        return 'Unknown';
      }
    });
    return 'Loading...';
  }

  get isManager(): boolean {
    return this.currentUser?.role === UserRole.MANAGER;
  }

  get isEmployee(): boolean {
    return this.currentUser?.role === UserRole.EMPLOYEE;
  }
}
