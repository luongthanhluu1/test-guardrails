interface Info {
  title: string;
  description: string;
  photo: string;
}
export interface Voucher {
  created_at: string;
  expiring_days: number;
  id: number;
  info: Info;
  limit_per_day: number;
  max_value: number;
  min_order_value: number;
  min_value: number;
  points: number;
  type: string;
  value: number;
}

export interface PartnerVoucher {}
