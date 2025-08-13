import { Injectable } from '@angular/core';
import { Announcement } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private announcements: Announcement[] = [
    {
      id: 1,
      title: 'Company Town Hall Meeting',
      content: 'Join us for our quarterly town hall meeting where we will discuss company updates, achievements, and future plans.',
      eventDate: new Date('2025-09-15'),
      startTime: '14:00',
      endTime: '16:00',
      location: 'Main Conference Room',
      isEvent: true,
      createdBy: 2,
      createdDate: new Date('2025-07-01'),
      isActive: true,
      priority: 'high',
      targetAudience: 'all'
    },
    {
      id: 2,
      title: 'New Employee Onboarding',
      content: 'Welcome to our new team members! Please complete the onboarding process by the end of this week.',
      isEvent: false,
      createdBy: 2,
      createdDate: new Date('2025-07-10'),
      isActive: true,
      priority: 'medium',
      targetAudience: 'all'
    },
    {
      id: 3,
      title: 'IT Maintenance Schedule',
      content: 'Scheduled maintenance will be performed on Saturday, August 23rd from 2:00 AM to 6:00 AM. Some services may be temporarily unavailable.',
      isEvent: false,
      createdBy: 1,
      createdDate: new Date('2025-07-15'),
      isActive: true,
      priority: 'medium',
      targetAudience: 'all'
    },
    {
      id: 4,
      title: 'Team Building Event',
      content: 'Join us for a fun team building event at the local park. Activities include games, food, and networking.',
      eventDate: new Date('2025-09-20'),
      startTime: '10:00',
      endTime: '16:00',
      location: 'Central Park',
      isEvent: true,
      createdBy: 2,
      createdDate: new Date('2025-07-05'),
      isActive: true,
      priority: 'low',
      targetAudience: 'all'
    },
    {
      id: 5,
      title: 'Manager Training Session',
      content: 'Mandatory training session for all managers on new performance management system.',
      eventDate: new Date('2025-08-25'),
      startTime: '09:00',
      endTime: '12:00',
      location: 'Training Room A',
      isEvent: true,
      createdBy: 2,
      createdDate: new Date('2025-07-12'),
      isActive: true,
      priority: 'high',
      targetAudience: 'managers'
    },
    {
      id: 6,
      title: 'Holiday Schedule Update',
      content: 'The office will be closed on Independence Day, August 15th. Please plan your work accordingly.',
      isEvent: false,
      createdBy: 2,
      createdDate: new Date('2025-07-08'),
      isActive: true,
      priority: 'medium',
      targetAudience: 'all'
    },
    {
      id: 7,
      title: 'Quarterly Financial Review',
      content: 'Join us for the quarterly financial review meeting to discuss our financial performance and future projections.',
      eventDate: new Date('2025-10-01'),
      startTime: '15:00',
      endTime: '17:00',
      location: 'Main Conference Room',
      isEvent: true,
      createdBy: 1,
      createdDate: new Date('2025-08-01'),
      isActive: true,
      priority: 'high',
      targetAudience: 'all'
    },
    {
      id: 8,
      title: 'Office Potluck',
      content: 'Bring your favorite dish to share with the team at our office potluck on Friday!',
      isEvent: false,
      createdBy: 2,
      createdDate: new Date('2025-08-10'),
      isActive: true,
      priority: 'medium',
      targetAudience: 'all'
    },
    {
      id: 9,
      title: 'Health and Wellness Fair',
      content: 'Participate in our Health and Wellness Fair to learn about health resources and activities available to employees.',
      eventDate: new Date('2025-09-30'),
      startTime: '09:00',
      endTime: '15:00',
      location: 'Company Gym',
      isEvent: true,
      createdBy: 2,
      createdDate: new Date('2025-08-15'),
      isActive: true,
      priority: 'low',
      targetAudience: 'employees'
    }
  ];

  private nextId = 10;

  constructor() { }

  getAllAnnouncements(): Announcement[] {
    return this.announcements;
  }

  getActiveAnnouncements(): Announcement[] {
    return this.announcements.filter(announcement => announcement.isActive);
  }

  getAnnouncementsByAudience(audience: 'all' | 'employees' | 'managers'): Announcement[] {
    return this.announcements.filter(announcement => 
      announcement.isActive && 
      (announcement.targetAudience === 'all' || announcement.targetAudience === audience)
    );
  }

  getEvents(): Announcement[] {
    return this.announcements.filter(announcement => 
      announcement.isActive && announcement.isEvent
    );
  }

  getAnnouncementById(id: number): Announcement | undefined {
    return this.announcements.find(ann => ann.id === id);
  }

  createAnnouncement(announcement: Announcement): Announcement {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: this.nextId++,
      createdDate: new Date()
    };
    
    this.announcements.push(newAnnouncement);
    return newAnnouncement;
  }

  updateAnnouncement(id: number, updates: Partial<Announcement>): Announcement | null {
    const annIndex = this.announcements.findIndex(ann => ann.id === id);
    
    if (annIndex !== -1) {
      this.announcements[annIndex] = {
        ...this.announcements[annIndex],
        ...updates
      };
      return this.announcements[annIndex];
    }
    
    return null;
  }

  deleteAnnouncement(id: number): boolean {
    const annIndex = this.announcements.findIndex(ann => ann.id === id);
    
    if (annIndex !== -1) {
      this.announcements.splice(annIndex, 1);
      return true;
    }
    
    return false;
  }

  getAnnouncementsByPriority(priority: 'low' | 'medium' | 'high'): Announcement[] {
    return this.announcements.filter(announcement => 
      announcement.isActive && announcement.priority === priority
    );
  }

  getUpcomingEvents(): Announcement[] {
    const now = new Date();
    return this.announcements.filter(announcement => 
      announcement.isActive && 
      announcement.isEvent && 
      announcement.eventDate && 
      announcement.eventDate > now
    );
  }

  searchAnnouncements(query: string): Announcement[] {
    const searchTerm = query.toLowerCase();
    return this.announcements.filter(announcement => 
      announcement.isActive && (
        announcement.title.toLowerCase().includes(searchTerm) ||
        announcement.content.toLowerCase().includes(searchTerm)
      )
    );
  }
}
