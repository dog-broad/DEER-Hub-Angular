export interface Announcement {
  id: number;
  title: string;
  content: string;
  isEvent: boolean;
  eventDate?: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  createdBy: number;
  createdDate: Date;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'employees' | 'managers';
}

