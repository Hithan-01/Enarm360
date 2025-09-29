import axios from 'axios';

export interface SubscriptionPlanDTOMin {
  id: number;
  name: string;
  price: string | number;
  currency: 'USD' | 'MXN' | 'EUR';
  billingInterval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING';

export interface UserSubscriptionDTO {
  id: number;
  userId: number;
  userEmail?: string;
  userName?: string;
  plan: SubscriptionPlanDTOMin;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew?: boolean;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isExpired?: boolean;
  daysRemaining?: number;
}

export interface CreateSubscriptionDTO {
  userId?: number; // si se omite, backend lo toma del token
  planId: number;
  startDate?: string; // ISO
  endDate?: string;   // ISO
  paymentMethod?: string;
  paymentReference?: string;
  couponCode?: string;
}

class UserSubscriptionService {
  private base = '/api/subscriptions';

  async getCurrentSubscription(): Promise<UserSubscriptionDTO | null> {
    const { data } = await axios.get<UserSubscriptionDTO>(`${this.base}/current`);
    return data || null;
  }

  async getHistory(): Promise<UserSubscriptionDTO[]> {
    const { data } = await axios.get<UserSubscriptionDTO[]>(`${this.base}/history`);
    return data;
  }

  async createSubscription(payload: CreateSubscriptionDTO): Promise<UserSubscriptionDTO> {
    const { data } = await axios.post<UserSubscriptionDTO>(`${this.base}`, payload);
    return data;
  }

  async cancelSubscription(id: number): Promise<UserSubscriptionDTO> {
    const { data } = await axios.patch<UserSubscriptionDTO>(`${this.base}/${id}/cancel`);
    return data;
  }

  async renewSubscription(id: number): Promise<UserSubscriptionDTO> {
    const { data } = await axios.patch<UserSubscriptionDTO>(`${this.base}/${id}/renew`);
    return data;
  }

  async getExpiring(daysAhead = 7): Promise<UserSubscriptionDTO[]> {
    const { data } = await axios.get<UserSubscriptionDTO[]>(`${this.base}/expiring`, { params: { daysAhead } });
    return data;
  }
}

export const userSubscriptionService = new UserSubscriptionService();
export default userSubscriptionService;