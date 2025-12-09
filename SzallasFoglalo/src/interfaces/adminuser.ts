export interface AdminUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    bookingCount: number;
    createdAt: string;
  }