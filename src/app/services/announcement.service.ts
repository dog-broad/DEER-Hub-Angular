import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Announcement } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`);
  }

  getActiveAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements?isActive=true`);
  }

  getAnnouncementsByAudience(audience: 'all' | 'employees' | 'managers'): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements?targetAudience=${audience}`);
  }

  getEvents(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements?isEvent=true`);
  }

  getAnnouncementById(id: number): Observable<Announcement | undefined> {
    return this.http.get<Announcement>(`${this.apiUrl}/announcements/${id}`);
  }

  createAnnouncement(announcement: Announcement): Observable<Announcement> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`).pipe(
      switchMap(announcements => {
        const newAnnouncement: Announcement = {
          ...announcement,
          id: this.getNextId(announcements),
          createdDate: new Date()
        };
        return this.http.post<Announcement>(`${this.apiUrl}/announcements`, newAnnouncement);
      })
    );
  }

  updateAnnouncement(id: number, updates: Partial<Announcement>): Observable<Announcement | null> {
    return this.http.patch<Announcement>(`${this.apiUrl}/announcements/${id}`, updates);
  }

  deleteAnnouncement(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/announcements/${id}`).pipe(
      map(() => true)
    );
  }

  getAnnouncementsByPriority(priority: 'low' | 'medium' | 'high'): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`).pipe(
      map(announcements => announcements.filter(announcement => 
        announcement.isActive && announcement.priority === priority
      ))
    );
  }

  getUpcomingEvents(): Observable<Announcement[]> {
    const now = new Date();
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`).pipe(
      map(announcements => announcements.filter(announcement => 
        announcement.isActive && 
        announcement.isEvent && 
        announcement.eventDate && 
        new Date(announcement.eventDate) > now
      ))
    );
  }

  searchAnnouncements(query: string): Observable<Announcement[]> {
    const searchTerm = query.toLowerCase();
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`).pipe(
      map(announcements => announcements.filter(announcement => 
        announcement.isActive && (
          announcement.title.toLowerCase().includes(searchTerm) ||
          announcement.content.toLowerCase().includes(searchTerm)
        )
      ))
    );
  }

  private getNextId(announcements: Announcement[]): number {
    return Math.max(...announcements.map(a => a.id), 0) + 1;
  }
}
