import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Leave, LeaveStatus, LeaveType } from '../models/leave.model';

@Injectable({
    providedIn: 'root'
})
export class LeaveService {
    private apiUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    getLeavesByUser(userId: number): Observable<Leave[]> {
        return this.http.get<Leave[]>(`${this.apiUrl}/leaves?userId=${userId}`);
    }

    getAllLeaves(): Observable<Leave[]> {
        return this.http.get<Leave[]>(`${this.apiUrl}/leaves`);
    }

    getLeaveById(id: number): Observable<Leave | undefined> {
        return this.http.get<Leave>(`${this.apiUrl}/leaves/${id}`);
    }

    applyLeave(leave: Omit<Leave, 'id' | 'status' | 'appliedDate'>): Observable<Leave> {
        return this.http.get<Leave[]>(`${this.apiUrl}/leaves`).pipe(
            switchMap(leaves => {
                const newLeave: Leave = {
                    ...leave,
                    id: this.getNextId(leaves),
                    status: LeaveStatus.PENDING,
                    appliedDate: new Date()
                };
                return this.http.post<Leave>(`${this.apiUrl}/leaves`, newLeave);
            })
        );
    }

    updateLeaveStatus(leaveId: number, status: LeaveStatus, approvedBy: number, comments?: string): Observable<Leave | null> {
        const updates: Partial<Leave> = {
            status,
            approvedBy,
            approvedDate: new Date(),
            comments
        };
        return this.http.patch<Leave>(`${this.apiUrl}/leaves/${leaveId}`, updates);
    }

    deleteLeave(leaveId: number): Observable<boolean> {
        return this.http.delete(`${this.apiUrl}/leaves/${leaveId}`).pipe(
            map(() => true)
        );
    }

    getLeavesByStatus(status: LeaveStatus): Observable<Leave[]> {
        return this.http.get<Leave[]>(`${this.apiUrl}/leaves`).pipe(
            map(leaves => leaves.filter(leave => leave.status === status))
        );
    }

    getPendingLeaves(): Observable<Leave[]> {
        return this.getLeavesByStatus(LeaveStatus.PENDING);
    }

    private getNextId(leaves: Leave[]): number {
        return Math.max(...leaves.map(l => l.id), 0) + 1;
    }
}

