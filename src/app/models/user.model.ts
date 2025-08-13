export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager'
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  createdAt: Date;
}
