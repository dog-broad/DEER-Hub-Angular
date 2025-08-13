import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    }
  ];

  private nextId = 7;

  constructor() { }

  getAllAnnouncements(): Observable<Announcement[]> {
    return of([...this.announcements]);
  }

  getActiveAnnouncements(): Observable<Announcement[]> {
    const activeAnnouncements = this.announcements.filter(announcement => announcement.isActive);
    return of(activeAnnouncements);
  }

  getAnnouncementsByAudience(audience: 'all' | 'employees' | 'managers'): Observable<Announcement[]> {
    const filteredAnnouncements = this.announcements.filter(announcement => 
      announcement.isActive && 
      (announcement.targetAudience === 'all' || announcement.targetAudience === audience)
    );
    return of(filteredAnnouncements);
  }

  getEvents(): Observable<Announcement[]> {
    const events = this.announcements.filter(announcement => 
      announcement.isActive && announcement.isEvent
    );
    return of(events);
  }

  getAnnouncementById(id: number): Observable<Announcement | undefined> {
    const announcement = this.announcements.find(ann => ann.id === id);
    return of(announcement);
  }

  createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdDate'>): Observable<Announcement> {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: this.nextId++,
      createdDate: new Date()
    };
    
    this.announcements.push(newAnnouncement);
    return of(newAnnouncement);
  }

  updateAnnouncement(id: number, updates: Partial<Announcement>): Observable<Announcement | null> {
    const annIndex = this.announcements.findIndex(ann => ann.id === id);
    
    if (annIndex !== -1) {
      this.announcements[annIndex] = {
        ...this.announcements[annIndex],
        ...updates
      };
      return of(this.announcements[annIndex]);
    }
    
    return of(null);
  }

  deleteAnnouncement(id: number): Observable<boolean> {
    const annIndex = this.announcements.findIndex(ann => ann.id === id);
    
    if (annIndex !== -1) {
      this.announcements.splice(annIndex, 1);
      return of(true);
    }
    
    return of(false);
  }

  getAnnouncementsByPriority(priority: 'low' | 'medium' | 'high'): Observable<Announcement[]> {
    const filteredAnnouncements = this.announcements.filter(announcement => 
      announcement.isActive && announcement.priority === priority
    );
    return of(filteredAnnouncements);
  }

  getUpcomingEvents(): Observable<Announcement[]> {
    const now = new Date();
    const upcomingEvents = this.announcements.filter(announcement => 
      announcement.isActive && 
      announcement.isEvent && 
      announcement.eventDate && 
      announcement.eventDate > now
    );
    return of(upcomingEvents);
  }

  searchAnnouncements(query: string): Observable<Announcement[]> {
    const searchTerm = query.toLowerCase();
    const filteredAnnouncements = this.announcements.filter(announcement => 
      announcement.isActive && (
        announcement.title.toLowerCase().includes(searchTerm) ||
        announcement.content.toLowerCase().includes(searchTerm)
      )
    );
    return of(filteredAnnouncements);
  }
}
