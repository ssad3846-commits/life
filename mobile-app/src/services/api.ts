import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Member,
  MembershipPlan,
  Subscription,
  Payment,
  Invoice,
  CheckIn,
  LoginCredentials,
  AuthResponse,
  Offer
} from '../types';

// ==================== API CONFIGURATION ====================
// PRODUCTION - Published on Replit
// Updated: November 2025
// ===========================================================

const API_BASE_URL = 'https://8c2d43d1-e5a2-4b8d-bdf4-cb79466005c0-00-147si13dzp26e.janeway.replit.dev';

// ==================== DEVELOPMENT NOTES ====================
// For local testing on phone/emulator:
// - Use your computer's IP address: 'http://192.168.1.100:5000'
// - Find your IP: ifconfig (Mac/Linux) or ipconfig (Windows)
// - DO NOT use 'localhost' - it won't work on real devices
// ===========================================================

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // This enables session cookies
    });

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear session on unauthorized
          await AsyncStorage.removeItem('memberId');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/member/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/api/member/logout');
    await AsyncStorage.removeItem('memberId');
  }

  // Member
  async getMemberInfo(): Promise<Member> {
    const response = await this.api.get<Member>('/api/member/me');
    return response.data;
  }

  async updateMember(data: Partial<Member>): Promise<Member> {
    const response = await this.api.patch<Member>('/api/member/me', data);
    return response.data;
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    const response = await this.api.get<Subscription[]>('/api/member/subscriptions');
    return response.data;
  }

  async getActiveSubscription(): Promise<Subscription | null> {
    const subscriptions = await this.getSubscriptions();
    const active = subscriptions.find(s => s.status === 'active');
    return active || null;
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    const response = await this.api.get<Payment[]>('/api/member/payments');
    return response.data;
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    const response = await this.api.get<Invoice[]>('/api/member/invoices');
    return response.data;
  }

  async downloadInvoice(invoiceId: number): Promise<Blob> {
    const response = await this.api.get(`/api/member/invoices/${invoiceId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Plans
  async getPlans(): Promise<MembershipPlan[]> {
    const response = await this.api.get<MembershipPlan[]>('/api/member/plans');
    return response.data;
  }

  // Check-ins
  async getCheckIns(): Promise<CheckIn[]> {
    const response = await this.api.get<CheckIn[]>('/api/member/check-ins');
    return response.data;
  }

  // Offers
  async getOffers(): Promise<Offer[]> {
    const response = await this.api.get<Offer[]>('/api/offers');
    return response.data;
  }

  // Push Notifications
  async updatePushToken(token: string): Promise<void> {
    await this.api.post('/api/member/push-token', { token });
  }
}

export default new ApiService();
