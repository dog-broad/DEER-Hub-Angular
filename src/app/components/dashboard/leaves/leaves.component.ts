import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LeaveService } from '../../../services/leave.service';
import { Leave, LeaveStatus, LeaveType } from '../../../models/leave.model';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {
  leaves: Leave[] = [];
  filteredLeaves: Leave[] = [];
  currentUser: any;
  searchTerm: string = '';

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLeaves();
  }

  loadLeaves(): void {
    if (this.currentUser?.role === UserRole.MANAGER) {
      this.leaveService.getAllLeaves().subscribe({
        next: (allLeaves) => {
          this.leaves = allLeaves;
          this.applySearch();
        }
      });
    } else {
      this.leaveService.getLeavesByUser(this.currentUser.id).subscribe({
        next: (userLeaves) => {
          this.leaves = userLeaves;
          this.applySearch();
        }
      });
    }
  }

  applySearch(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredLeaves = this.leaves.filter(leave =>
      leave.reason.toLowerCase().includes(search) ||
      this.getLeaveTypeText(leave.leaveType).toLowerCase().includes(search)
    );
  }

  onSearchChange(): void {
    this.applySearch();
  }

  cancelLeave(leaveId: number): void {
    if (confirm('Are you sure you want to cancel this leave request?')) {
      this.leaveService.updateLeaveStatus(leaveId, LeaveStatus.CANCELLED, this.currentUser.id).subscribe({
        next: () => this.loadLeaves()
      });
    }
  }

  approveLeave(leaveId: number): void {
    const comment = prompt('Please enter the approval comment:');
    if (comment) {
      this.leaveService.updateLeaveStatus(leaveId, LeaveStatus.APPROVED, this.currentUser.id, comment).subscribe({
        next: () => this.loadLeaves()
      });
    }
  }

  rejectLeave(leaveId: number): void {
    this.leaveService.updateLeaveStatus(leaveId, LeaveStatus.REJECTED, this.currentUser.id).subscribe({
      next: () => this.loadLeaves()
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

  getStatusBadgeClass(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.PENDING: return 'badge bg-warning';
      case LeaveStatus.APPROVED: return 'badge bg-success';
      case LeaveStatus.REJECTED: return 'badge bg-danger';
      case LeaveStatus.CANCELLED: return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }

  getStatusText(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.PENDING: return 'Pending';
      case LeaveStatus.APPROVED: return 'Approved';
      case LeaveStatus.REJECTED: return 'Rejected';
      case LeaveStatus.CANCELLED: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getLeaveTypeText(type: LeaveType): string {
    switch (type) {
      case LeaveType.SICK: return 'Sick Leave';
      case LeaveType.VACATION: return 'Vacation Leave';
      case LeaveType.PERSONAL: return 'Personal Leave';
      case LeaveType.MATERNITY: return 'Maternity Leave';
      case LeaveType.PATERNITY: return 'Paternity Leave';
      case LeaveType.OTHER: return 'Other Leave';
      default: return 'Unknown';
    }
  }

  getLeaveTypeBadgeClass(type: LeaveType): string {
    switch (type) {
      case LeaveType.SICK: return 'badge bg-danger';
      case LeaveType.VACATION: return 'badge bg-info';
      case LeaveType.PERSONAL: return 'badge bg-primary';
      case LeaveType.MATERNITY:
      case LeaveType.PATERNITY: return 'badge bg-purple';
      case LeaveType.OTHER: return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
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
