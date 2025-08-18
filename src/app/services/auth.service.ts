import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          this.setCurrentUser(user);
          console.log("Current User after login", this.currentUser);
          return user;
        }
        return null;
      })
    );
  }

  register(userData: Omit<User, 'id' | 'createdAt' | 'isActive'>): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      switchMap(users => {
        const existingUser = users.find(u => 
          u.username === userData.username || u.email === userData.email
        );
        if (existingUser) {
          return of(null); // User already exists
        }

        const newUser: User = {
          ...userData,
          id: this.getNextId(users),
          isActive: true,
          createdAt: new Date()
        };

        return this.http.post<User>(`${this.apiUrl}/users`, newUser).pipe(
          tap(user => this.setCurrentUser(user))
        );
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }


  getUserById(userId: number): Observable<User | undefined> {
    return this.http.get<User>(`${this.apiUrl}/users?id=${userId}`);
  }

  isLoggedIn(): Observable<boolean> {
    return of(this.currentUser !== null);
  }

  isManager(): Observable<boolean> {
    return of(this.currentUser?.role === UserRole.MANAGER);
  }

  isEmployee(): Observable<boolean> {
    return of(this.currentUser?.role === UserRole.EMPLOYEE);
  }

  private setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    console.log("Stored User", storedUser);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.createdAt = new Date(user.createdAt);
      this.currentUser = user;
    }
  }

  private getNextId(users: User[]): number {
    return Math.max(...users.map(u => u.id), 0) + 1;
  }
}

