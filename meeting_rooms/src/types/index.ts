export type UserRole = 'analyst' | 'employee' | 'admin';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';
export type Theme = 'blue' | 'green' | 'purple' | 'orange' | 'dark' | 'pink' | 'sea';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface Room {
  id: number;
  name: string;
  roomNumber: string;
  capacity: number;
  equipment: string[];
  image: string;
  isActive: boolean;
}

export interface Booking {
  id: number;
  roomId: number;
  roomName: string;
  userId: number;
  userName: string;
  userEmail: string;
  date: string;
  startTime: number;
  endTime: number;
  topic: string;
  description?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface TimeSlot {
  hour: number;
  isBooked: boolean;
  isSelected: boolean;
  booking?: Booking;
}

export interface TimeRange {
  start: number | null;
  end: number | null;
}

export interface BookingFormData {
  roomId: number;
  date: string;
  startTime: number;
  endTime: number;
  topic: string;
  description: string;
}

export interface LoginForm {
  username: string;
  password: string;
}