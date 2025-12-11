// Shared types from backend schema
export interface Member {
  id: number;
  memberNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  photoUrl?: string;
  joinDate: string;
  status: 'new' | 'active' | 'former';
}

export interface MembershipPlan {
  id: number;
  name: string;
  duration: number;
  durationUnit: 'days' | 'months' | 'years';
  price: string;
  taxPercentage: string;
  description?: string;
  isActive: boolean;
}

export interface Subscription {
  id: number;
  memberId: number;
  planId: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
}

export interface Payment {
  id: number;
  memberId: number;
  subscriptionId?: number;
  invoiceId?: number;
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  notes?: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  memberId: number;
  subscriptionId?: number;
  amount: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

export interface CheckIn {
  id: number;
  memberId: number;
  checkInTime: string;
  checkOutTime?: string;
}

export interface LoginCredentials {
  idNumber: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  memberId?: number;
  message?: string;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  discountPercentage?: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  isActive: boolean;
}
