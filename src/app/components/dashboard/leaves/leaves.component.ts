import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LeaveService } from '../../../services/leave.service';
import { Leave, LeaveStatus, LeaveType } from '../../../models/leave.model';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent {
  leaves: Leave[] = [];
  filteredLeaves: Leave[] = [];
  currentUser: any;
  selectedStatus: string = 'all';
  selectedType: string = 'all';
  searchTerm: string = '';

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLeaves();
  }

  loadLeaves(): void {
    if (this.authService.isManager()) {
      this.leaves = this.leaveService.getAllLeaves();
    } else {
      this.leaves = this.leaveService.getLeavesByUser(this.currentUser.id);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredLeaves = this.leaves.filter(leave => {
      const statusMatch = this.selectedStatus === 'all' || leave.status === this.selectedStatus;
      const typeMatch = this.selectedType === 'all' || leave.leaveType === this.selectedType;
      const searchMatch = !this.searchTerm || 
        leave.reason.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return statusMatch && typeMatch && searchMatch;
    });
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  cancelLeave(leaveId: number): void {
    if (confirm('Are you sure you want to cancel this leave request?')) {
      this.leaveService.updateLeaveStatus(leaveId, LeaveStatus.CANCELLED, this.currentUser.id);
      this.loadLeaves();
    }
  }

  approveLeave(leaveId: number): void {
    let comment = prompt('Please enter the approval comment:');
    if (comment) {
      this.leaveService.updateLeaveStatus(leaveId, LeaveStatus.APPROVED, this.currentUser.id, comment);
      this.loadLeaves();
    }
  }

  rejectLeave(leaveId: number): void {
    this.leaveService.updateLeaveStatus(leaveId, LeaveStatus.REJECTED, this.currentUser.id);
    this.loadLeaves();
  }

  get isManager(): boolean {
    return this.authService.isManager();
  }

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  getNameByUserId(userId: number): string {
    const user = this.authService.getUserById(userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }

  canCancel(leave: Leave): boolean {
    return leave.status === LeaveStatus.PENDING && 
           (this.isEmployee || this.isManager) &&
           leave.userId === this.currentUser.id;
  }

  canApproveReject(leave: Leave): boolean {
    return this.isManager && leave.status === LeaveStatus.PENDING;
  }
}
