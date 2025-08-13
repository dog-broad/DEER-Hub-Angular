import { Injectable } from '@angular/core';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      username: 'rahul.kumar',
      email: 'rahul.kumar@company.com',
      password: 'password123',
      firstName: 'Rahul',
      lastName: 'Kumar',
      role: UserRole.EMPLOYEE,
      department: 'IT',
      isActive: true,
      createdAt: new Date('2025-06-15')
    },
    {
      id: 2,
      username: 'priya.sharma',
      email: 'priya.sharma@company.com',
      password: 'password123',
      firstName: 'Priya',
      lastName: 'Sharma',
      role: UserRole.MANAGER,
      department: 'HR',
      isActive: true,
      createdAt: new Date('2025-06-10')
    },
    {
      id: 3,
      username: 'amit.patel',
      email: 'amit.patel@company.com',
      password: 'password123',
      firstName: 'Amit',
      lastName: 'Patel',
      role: UserRole.EMPLOYEE,
      department: 'Marketing',
      isActive: true,
      createdAt: new Date('2025-07-01')
    }
  ];

  private nextId = 4;
  private currentUser: User | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  login(username: string, password: string): User | null {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    return null;
  }

  register(userData: Omit<User, 'id' | 'createdAt' | 'isActive'>): User | null {
    const existingUser = this.users.find(u => 
      u.username === userData.username || u.email === userData.email
    );
    if (existingUser) {
      return null; // User already exists
    }

    const newUser: User = {
      ...userData,
      id: this.nextId++,
      isActive: true,
      createdAt: new Date()
    };

    this.users.push(newUser);
    this.setCurrentUser(newUser);
    return newUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isManager(): boolean {
    return this.currentUser?.role === UserRole.MANAGER;
  }

  isEmployee(): boolean {
    return this.currentUser?.role === UserRole.EMPLOYEE;
  }

  private setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.createdAt = new Date(user.createdAt);
      this.currentUser = user;
    }
  }
}

