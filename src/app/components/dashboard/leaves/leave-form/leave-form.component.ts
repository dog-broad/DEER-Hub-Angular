import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { LeaveService } from '../../../../services/leave.service';
import { Leave, LeaveType } from '../../../../models/leave.model';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent {
  leaveForm: FormGroup;
  isEditMode = false;
  leaveId: number | null = null;
  currentUser: any;
  leaveTypes = Object.values(LeaveType);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private leaveService: LeaveService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.leaveForm = this.createForm();
    this.currentUser = this.authService.getCurrentUser();
    this.checkEditMode();
  }

  createForm(): FormGroup {
    return this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.leaveId = +id;
      this.loadLeave();
    }
  }

  loadLeave(): void {
    if (this.leaveId) {
      const leave = this.leaveService.getLeaveById(this.leaveId);
      if (leave && leave.userId === this.currentUser.id) {
        this.leaveForm.patchValue({
          leaveType: leave.leaveType,
          startDate: this.formatDateForInput(leave.startDate),
          endDate: this.formatDateForInput(leave.endDate),
          reason: leave.reason
        });
      } else {
        this.router.navigate(['/dashboard/leaves']);
      }
    }
  }

  formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  calculateDays(): number {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1; // Include both start and end dates
    }
    return 0;
  }

  validateDates(): boolean {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start < today) {
        alert('Start date cannot be in the past');
        return false;
      }
      
      if (end < start) {
        alert('End date cannot be before start date');
        return false;
      }
    }
    return true;
  }

  onSubmit(): void {
    if (this.leaveForm.valid && this.validateDates()) {
      const formValue = this.leaveForm.value;
      
      const leaveData = {
        userId: this.currentUser.id,
        leaveType: formValue.leaveType,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        reason: formValue.reason
      };

      if (this.isEditMode && this.leaveId) {
        // For editing, we would need to implement an update method
        // For now, we'll just navigate back
        this.router.navigate(['/dashboard/leaves']);
      } else {
        this.leaveService.applyLeave(leaveData);
        this.router.navigate(['/dashboard/leaves']);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/leaves']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.leaveForm.controls).forEach(key => {
      const control = this.leaveForm.get(key);
      control?.markAsTouched();
    });
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

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }
}
