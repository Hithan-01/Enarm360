import axios from 'axios';

export interface PaymentHistoryDTO {
  id: number;
  subscriptionId?: number;
  userId?: number;
  userEmail?: string;
  planName?: string;
  amount: string | number;
  currency: 'USD' | 'MXN' | 'EUR';
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  description?: string;
}

class PaymentHistoryService {
  private base = '/api/payment-history';

  async getMyPayments(): Promise<PaymentHistoryDTO[]> {
    const { data } = await axios.get<PaymentHistoryDTO[]>(`${this.base}/my-payments`);
    return data;
  }

  async getRecent(limit = 10): Promise<PaymentHistoryDTO[]> {
    const { data } = await axios.get<PaymentHistoryDTO[]>(`${this.base}/recent`, { params: { limit } });
    return data;
  }

  async getTotalRevenue(): Promise<number> {
    const { data } = await axios.get<{ totalRevenue: number }>(`${this.base}/revenue/total`);
    return Number(data.totalRevenue || 0);
    
  }

  async getMonthlyRevenue(): Promise<number> {
    const { data } = await axios.get<{ monthlyRevenue: number }>(`${this.base}/revenue/monthly`);
    return Number(data.monthlyRevenue || 0);
  }

  async getRevenueBetween(startDateISO: string, endDateISO: string): Promise<number> {
    const { data } = await axios.get<{ revenue: number }>(`${this.base}/revenue/between`, { params: { startDate: startDateISO, endDate: endDateISO } });
    return Number(data.revenue || 0);
  }
}

export const paymentHistoryService = new PaymentHistoryService();
export default paymentHistoryService;