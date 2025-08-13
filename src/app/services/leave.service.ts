import { Injectable } from '@angular/core';
import { Leave, LeaveStatus, LeaveType } from '../models/leave.model';

@Injectable({
    providedIn: 'root'
})
export class LeaveService {
    private leaves: Leave[] = [
        {
            id: 1,
            userId: 1,
            leaveType: LeaveType.VACATION,
            startDate: new Date('2025-08-15'),
            endDate: new Date('2025-08-20'),
            reason: 'Family vacation',
            status: LeaveStatus.APPROVED,
            appliedDate: new Date('2025-06-20'),
            approvedBy: 2,
            approvedDate: new Date('2025-06-22'),
            comments: 'Approved - enjoy your vacation!'
        },
        {
            id: 2,
            userId: 1,
            leaveType: LeaveType.SICK,
            startDate: new Date('2025-06-10'),
            endDate: new Date('2025-06-12'),
            reason: 'Not feeling well',
            status: LeaveStatus.APPROVED,
            appliedDate: new Date('2025-06-09'),
            approvedBy: 2,
            approvedDate: new Date('2025-06-09'),
            comments: 'Get well soon!'
        },
        {
            id: 3,
            userId: 3,
            leaveType: LeaveType.PERSONAL,
            startDate: new Date('2025-09-01'),
            endDate: new Date('2025-09-03'),
            reason: 'Personal matters',
            status: LeaveStatus.PENDING,
            appliedDate: new Date('2025-07-15')
        },
        {
            id: 4,
            userId: 3,
            leaveType: LeaveType.VACATION,
            startDate: new Date('2025-10-10'),
            endDate: new Date('2025-10-15'),
            reason: 'Diwali vacation',
            status: LeaveStatus.PENDING,
            appliedDate: new Date('2025-07-20')
        },
        {
            id: 5,
            userId: 3,
            leaveType: LeaveType.PERSONAL,
            startDate: new Date('2025-11-01'),
            endDate: new Date('2025-11-03'),
            reason: 'Personal matters',
            status: LeaveStatus.REJECTED,
            appliedDate: new Date('2025-07-15')
        }
    ];

    private nextId = 6;

    getLeavesByUser(userId: number): Leave[] {
        return this.leaves.filter(leave => leave.userId === userId);
    }

    getAllLeaves(): Leave[] {
        return [...this.leaves];
    }

    getLeaveById(id: number): Leave | undefined {
        return this.leaves.find(l => l.id === id);
    }

    applyLeave(leave: Omit<Leave, 'id' | 'status' | 'appliedDate'>): Leave {
        const newLeave: Leave = {
            ...leave,
            id: this.nextId++,
            status: LeaveStatus.PENDING,
            appliedDate: new Date()
        };

        this.leaves.push(newLeave);
        return newLeave;
    }

    updateLeaveStatus(leaveId: number, status: LeaveStatus, approvedBy: number, comments?: string): Leave | null {
        const leaveIndex = this.leaves.findIndex(l => l.id === leaveId);

        if (leaveIndex !== -1) {
            this.leaves[leaveIndex] = {
                ...this.leaves[leaveIndex],
                status,
                approvedBy,
                approvedDate: new Date(),
                comments
            };
            return this.leaves[leaveIndex];
        }

        return null;
    }

    deleteLeave(leaveId: number): boolean {
        const leaveIndex = this.leaves.findIndex(l => l.id === leaveId);

        if (leaveIndex !== -1) {
            this.leaves.splice(leaveIndex, 1);
            return true;
        }

        return false;
    }

    getLeavesByStatus(status: LeaveStatus): Leave[] {
        return this.leaves.filter(leave => leave.status === status);
    }

    getPendingLeaves(): Leave[] {
        return this.getLeavesByStatus(LeaveStatus.PENDING);
    }
}

