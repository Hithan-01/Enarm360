import axios from 'axios';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

// Fallback: ensure Authorization header is present even if global interceptors are not initialized yet
const authHeader = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token && token !== 'undefined' && token !== 'null') {
      const parts = token.split('.');
      if (parts.length === 3 && parts.every((p) => p.length > 0)) {
        return { Authorization: `Bearer ${token}` } as const;
      }
    }
  } catch (e) {
    // ignore
  }
  return {} as const;
};

export interface DiscountCouponDTO {
  id: number;
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: string | number;
  currency?: 'USD' | 'MXN' | 'EUR';
  minAmount?: string | number;
  maxDiscount?: string | number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  currentUsage?: number;
  applicablePlans?: number[] | null;
  startDate?: string;
  expirationDate?: string;
  isActive?: boolean;
  createdByEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  isValid?: boolean;
  remainingUses?: number;
}

export interface CreateDiscountCouponDTO {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  currency?: 'USD' | 'MXN' | 'EUR';
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  applicablePlans?: number[] | null;
  startDate?: string; // ISO
  expirationDate?: string; // ISO
}

export interface ValidateCouponDTO {
  couponCode: string;
  planId: number;
  amount: number;
}

export interface CouponValidationResultDTO {
  isValid: boolean;
  message: string;
  originalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  discountType?: DiscountType | string;
  discountValue?: number | string;
}

class DiscountCouponService {
  private base = '/api/coupons';

  async getAll(): Promise<DiscountCouponDTO[]> {
    const { data } = await axios.get<DiscountCouponDTO[]>(`${this.base}`, { headers: { ...authHeader() } });
    return data;
  }

  async getValid(): Promise<DiscountCouponDTO[]> {
    const { data } = await axios.get<DiscountCouponDTO[]>(`${this.base}/valid`, { headers: { ...authHeader() } });
    return data;
  }

  async getById(id: number): Promise<DiscountCouponDTO> {
    const { data } = await axios.get<DiscountCouponDTO>(`${this.base}/${id}`, { headers: { ...authHeader() } });
    return data;
  }

  async validate(payload: ValidateCouponDTO): Promise<CouponValidationResultDTO> {
    const { data } = await axios.post<CouponValidationResultDTO>(`${this.base}/validate`, payload, { headers: { ...authHeader() } });
    return data;
  }

  async create(payload: CreateDiscountCouponDTO): Promise<DiscountCouponDTO> {
    const { data } = await axios.post<DiscountCouponDTO>(`${this.base}`, payload, { headers: { ...authHeader() } });
    return data;
  }

  async update(id: number, payload: CreateDiscountCouponDTO): Promise<DiscountCouponDTO> {
    const { data } = await axios.put<DiscountCouponDTO>(`${this.base}/${id}`, payload, { headers: { ...authHeader() } });
    return data;
  }

  async deactivate(id: number): Promise<void> {
    await axios.patch(`${this.base}/${id}/deactivate`, null, { headers: { ...authHeader() } });
  }

  async remove(id: number): Promise<void> {
    await axios.delete(`${this.base}/${id}`, { headers: { ...authHeader() } });
  }
}

export const discountCouponService = new DiscountCouponService();
export default discountCouponService;
