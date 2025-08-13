import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { AnnouncementService } from '../../../../services/announcement.service';
import { Announcement } from '../../../../models/announcement.model';

@Component({
  selector: 'app-announcement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './announcement-form.component.html',
  styleUrls: ['./announcement-form.component.css']
})
export class AnnouncementFormComponent {
  announcementForm: FormGroup;
  isEditMode = false;
  announcementId: number | null = null;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private announcementService: AnnouncementService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.announcementForm = this.createForm();
    this.currentUser = this.authService.getCurrentUser();
    this.checkEditMode();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      isEvent: [false],
      priority: ['medium', Validators.required],
      targetAudience: ['all', Validators.required],
      // Event-specific fields
      eventDate: [null],
      startTime: [''],
      endTime: [''],
      location: ['']
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.announcementId = +id; // Convert string to number - easy way - or use Number(id)
      this.loadAnnouncement();
    }
  }

  loadAnnouncement(): void {
    if (this.announcementId) {
      const announcement = this.announcementService.getAnnouncementById(this.announcementId);
      if (announcement) {
        this.announcementForm.patchValue({
          title: announcement.title,
          content: announcement.content,
          isEvent: announcement.isEvent,
          priority: announcement.priority,
          targetAudience: announcement.targetAudience,
          eventDate: announcement.eventDate ? this.formatDateForInput(announcement.eventDate) : null,
          startTime: announcement.startTime || '',
          endTime: announcement.endTime || '',
          location: announcement.location || ''
        });
      }
    }
  }

  formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onIsEventChange(): void {
    const isEvent = this.announcementForm.get('isEvent')?.value;
    const eventDateControl = this.announcementForm.get('eventDate');
    const startTimeControl = this.announcementForm.get('startTime');
    const endTimeControl = this.announcementForm.get('endTime');
    const locationControl = this.announcementForm.get('location');

    if (isEvent) {
      eventDateControl?.setValidators([Validators.required]);
      startTimeControl?.setValidators([Validators.required]);
      endTimeControl?.setValidators([Validators.required]);
      locationControl?.setValidators([Validators.required]);
    } else {
      eventDateControl?.clearValidators();
      startTimeControl?.clearValidators();
      endTimeControl?.clearValidators();
      locationControl?.clearValidators();
    }

    eventDateControl?.updateValueAndValidity();
    startTimeControl?.updateValueAndValidity();
    endTimeControl?.updateValueAndValidity();
    locationControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      const formValue = this.announcementForm.value;
      
      const announcementData: Partial<Announcement> = {
        title: formValue.title,
        content: formValue.content,
        isEvent: formValue.isEvent,
        priority: formValue.priority,
        targetAudience: formValue.targetAudience,
        createdBy: this.currentUser?.id || 1,
        isActive: true
      };

      if (formValue.isEvent) {
        announcementData.eventDate = new Date(formValue.eventDate);
        announcementData.startTime = formValue.startTime;
        announcementData.endTime = formValue.endTime;
        announcementData.location = formValue.location;
      }

      if (this.isEditMode && this.announcementId) {
        this.announcementService.updateAnnouncement(this.announcementId, announcementData);
      } else {
        this.announcementService.createAnnouncement(announcementData as Announcement);
      }

      this.router.navigate(['/dashboard/announcements']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/announcements']);
  }

  get isManager(): boolean {
    return this.authService.isManager();
  }
}
