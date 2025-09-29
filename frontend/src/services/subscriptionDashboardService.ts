import axios from 'axios';

export interface SubscriptionSummaryDTO {
  monthlyRevenue: number;
  activeSubscriptions: number;
  growthRate?: number;
  retentionRate?: number;
  churnRate?: number;
  newSubscriptions?: number;
  cancelledSubscriptions?: number;
}

class SubscriptionDashboardService {
  private base = '/api/subscription-dashboard';

  async getSummary(): Promise<SubscriptionSummaryDTO> {
    const { data } = await axios.get<SubscriptionSummaryDTO>(`${this.base}/summary`);
    return data;
  }
}

export const subscriptionDashboardService = new SubscriptionDashboardService();
export default subscriptionDashboardService;