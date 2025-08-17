import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { AnnouncementService } from '../../../../services/announcement.service';
import { Announcement } from '../../../../models/announcement.model';
import { UserRole } from '../../../../models/user.model';

@Component({
  selector: 'app-announcement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './announcement-form.component.html',
  styleUrls: ['./announcement-form.component.css']
})
export class AnnouncementFormComponent implements OnInit {
  myForm!: FormGroup;
  currentUser: any;
  isEditMode = false;
  announcementId: number | null = null;

  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  targetAudiences = [
    { value: 'all', label: 'All Employees' },
    { value: 'employees', label: 'Employees Only' },
    { value: 'managers', label: 'Managers Only' }
  ];

  constructor(
    private authService: AuthService,
    private announcementService: AnnouncementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
  }

  get myFc() {
    return this.myForm.controls;
  }

  private initForm(): void {
    this.myForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      content: new FormControl('', [Validators.required, Validators.minLength(10)]),
      isEvent: new FormControl(false),
      eventDate: new FormControl(''),
      startTime: new FormControl(''),
      endTime: new FormControl(''),
      location: new FormControl(''),
      priority: new FormControl('medium', [Validators.required]),
      targetAudience: new FormControl('all', [Validators.required])
    });
  }

  validate(): void {
    if (this.myForm.valid && this.validateEventFields()) {
      const formValue = this.myForm.value;
      
      const announcementData = {
        title: formValue.title,
        content: formValue.content,
        isEvent: formValue.isEvent,
        eventDate: formValue.isEvent && formValue.eventDate ? new Date(formValue.eventDate) : undefined,
        startTime: formValue.isEvent ? formValue.startTime : undefined,
        endTime: formValue.isEvent ? formValue.endTime : undefined,
        location: formValue.isEvent ? formValue.location : undefined,
        createdBy: this.currentUser.id,
        priority: formValue.priority,
        targetAudience: formValue.targetAudience,
        isActive: true
      };

      if (this.isEditMode && this.announcementId) {
        this.announcementService.updateAnnouncement(this.announcementId, announcementData).subscribe({
          next: (result) => {
            alert('Announcement updated successfully!');
            this.router.navigate(['/dashboard/announcements']);
          },
          error: (error) => {
            alert('An error occurred while updating announcement');
          }
        });
      } else {
        this.announcementService.createAnnouncement(announcementData as Announcement).subscribe({
          next: (result) => {
            alert('Announcement created successfully!');
            this.router.navigate(['/dashboard/announcements']);
          },
          error: (error) => {
            alert('An error occurred while creating announcement');
          }
        });
      }
    }
  }

  private validateEventFields(): boolean {
    const isEvent = this.myForm.get('isEvent')?.value;
    
    if (isEvent) {
      const eventDate = this.myForm.get('eventDate')?.value;
      const startTime = this.myForm.get('startTime')?.value;
      const endTime = this.myForm.get('endTime')?.value;
      const location = this.myForm.get('location')?.value;
      
      if (!eventDate) {
        alert('Event date is required for events');
        return false;
      }
      
      if (!startTime || !endTime) {
        alert('Start time and end time are required for events');
        return false;
      }
      
      if (!location) {
        alert('Location is required for events');
        return false;
      }
    }
    
    return true;
  }

  get isManager(): boolean {
    return this.currentUser?.role === UserRole.MANAGER;
  }
}
