import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  features = [
    {
      icon: 'fas fa-calendar-alt',
      title: 'Leave Management',
      description: 'Streamlined leave requests and approvals'
    },
    {
      icon: 'fas fa-file-alt',
      title: 'Document Sharing',
      description: 'Secure file upload and sharing system'
    },
    {
      icon: 'fas fa-bullhorn',
      title: 'Announcements',
      description: 'Keep everyone informed with real-time updates'
    }
  ];
}

