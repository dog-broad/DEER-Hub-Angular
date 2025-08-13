import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  features = [
    {
      icon: 'fas fa-calendar-alt',
      title: 'Leave Management',
      description: 'Streamlined leave requests and approvals with automated workflows'
    },
    {
      icon: 'fas fa-file-alt',
      title: 'Document Sharing',
      description: 'Secure file upload and sharing system with version control'
    },
    {
      icon: 'fas fa-bullhorn',
      title: 'Announcements',
      description: 'Keep everyone informed with real-time updates and notifications'
    },
    {
      icon: 'fas fa-users',
      title: 'Employee Portal',
      description: 'Centralized hub for all employee-related activities'
    }
  ];
}
