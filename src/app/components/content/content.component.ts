import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  features = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with reliable performance'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Friendly',
      description: 'Access your dashboard from anywhere, anytime'
    },
    {
      icon: 'fas fa-clock',
      title: 'Real-time Updates',
      description: 'Instant notifications and live status updates'
    },
    {
      icon: 'fas fa-users',
      title: 'Team Collaboration',
      description: 'Enhanced communication and teamwork features'
    }
  ];
}
