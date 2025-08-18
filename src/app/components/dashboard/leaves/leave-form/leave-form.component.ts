import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { LeaveService } from '../../../../services/leave.service';
import { Leave, LeaveType } from '../../../../models/leave.model';
import { UserRole } from '../../../../models/user.model';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent implements OnInit {
  myForm!: FormGroup;
  currentUser: any;
  isEditMode = false;
  leaveId: number | null = null;
  today = new Date();

  leaveTypes = [
    { value: LeaveType.SICK, label: 'Sick Leave' },
    {value: LeaveType.VACATION, label: 'Vacation Leave' },
    { value: LeaveType.PERSONAL, label: 'Personal Leave' },
    { value: LeaveType.MATERNITY, label: 'Maternity Leave' },
    { value: LeaveType.PATERNITY, label: 'Paternity Leave' },
    { value: LeaveType.OTHER, label: 'Other Leave' }
  ];

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
    this.checkEditMode();
  }

  get myFc() {
    return this.myForm.controls;
  }

  private initForm(): void {
    this.myForm = new FormGroup({
      leaveType: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      reason: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  private checkEditMode(): void {
    // This would be implemented if we need edit functionality
    // For now, we'll keep it simple
  }

  calculateDays(): number {
    const startDate = this.myForm.get('startDate')?.value;
    const endDate = this.myForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1;
    }
    return 0;
  }

  validate(): void {
    if (this.myForm.valid && this.validateDates()) {
      const formValue = this.myForm.value;
      
      const leaveData = {
        userId: Number(this.currentUser.id),
        leaveType: formValue.leaveType,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        reason: formValue.reason
      };

      this.leaveService.applyLeave(leaveData).subscribe({
        next: (result) => {
          alert('Leave request submitted successfully!');
          this.router.navigate(['/dashboard/leaves']);
        },
        error: (error) => {
          alert('An error occurred while submitting leave request');
        }
      });
    }
  }

  private validateDates(): boolean {
    const startDate = this.myForm.get('startDate')?.value;
    const endDate = this.myForm.get('endDate')?.value;
    
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

  get isEmployee(): boolean {
    return this.currentUser?.role === UserRole.EMPLOYEE;
  }
}
