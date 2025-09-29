import axios from 'axios';

// Types basados en los DTOs del backend
export type BillingInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface SubscriptionPlanDTO {
  id: number;
  name: string;
  description?: string;
  price: string | number; // el backend usa BigDecimal, aquí aceptamos number o string
  currency: 'USD' | 'MXN' | 'EUR';
  billingInterval: BillingInterval;
  features?: string[];
  isActive?: boolean;
  maxAttempts?: number;
  hasClinicalCases?: boolean;
  hasExpertExplanations?: boolean;
  hasDetailedAnalytics?: boolean;
  hasProgressTracking?: boolean;
  hasPrioritySupport?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subscribersCount?: number;
  totalRevenue?: string | number;
}

export interface CreateSubscriptionPlanDTO {
  name: string;
  description?: string;
  price: number; // usar number en el front
  currency?: 'USD' | 'MXN' | 'EUR';
  billingInterval: BillingInterval;
  features?: string[];
  maxAttempts?: number;
  hasClinicalCases?: boolean;
  hasExpertExplanations?: boolean;
  hasDetailedAnalytics?: boolean;
  hasProgressTracking?: boolean;
  hasPrioritySupport?: boolean;
}

class SubscriptionPlanService {
  private base = '/api/subscription-plans';

  async getAllActivePlans(): Promise<SubscriptionPlanDTO[]> {
    const { data } = await axios.get<SubscriptionPlanDTO[]>(`${this.base}`);
    return data;
  }

  async getAllPlans(): Promise<SubscriptionPlanDTO[]> {
    const { data } = await axios.get<SubscriptionPlanDTO[]>(`${this.base}/all`);
    return data;
  }

  async getPlanById(id: number): Promise<SubscriptionPlanDTO> {
    const { data } = await axios.get<SubscriptionPlanDTO>(`${this.base}/${id}`);
    return data;
  }

  async getPlanByName(name: string): Promise<SubscriptionPlanDTO> {
    const { data } = await axios.get<SubscriptionPlanDTO>(`${this.base}/by-name/${encodeURIComponent(name)}`);
    return data;
  }

  async createPlan(payload: CreateSubscriptionPlanDTO): Promise<SubscriptionPlanDTO> {
    const body = {
      currency: 'USD',
      ...payload,
    };
    const { data } = await axios.post<SubscriptionPlanDTO>(`${this.base}`, body);
    return data;
  }

  async updatePlan(id: number, payload: CreateSubscriptionPlanDTO): Promise<SubscriptionPlanDTO> {
    const { data } = await axios.put<SubscriptionPlanDTO>(`${this.base}/${id}`, payload);
    return data;
  }

  async activatePlan(id: number): Promise<void> {
    await axios.patch(`${this.base}/${id}/activate`);
  }

  async deactivatePlan(id: number): Promise<void> {
    await axios.patch(`${this.base}/${id}/deactivate`);
  }

  async deletePlan(id: number): Promise<void> {
    await axios.delete(`${this.base}/${id}`);
  }
}

export const subscriptionPlanService = new SubscriptionPlanService();
export default subscriptionPlanService;