export interface Announcement {
  id: number;
  title: string;
  content: string;
  eventDate?: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  isEvent: boolean;
  createdBy: number;
  createdDate: Date;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'employees' | 'managers';
}

