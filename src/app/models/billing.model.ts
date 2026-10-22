export interface BillingRecord {
  id: number | string;
  orderNumber: string;
  orderDate: string;
  orderTime: string;
  alertCount: number;
  reseller: string;
  resellerId: string;
  invoiceId: string;
  customerType: string;
  country: string;
  currency: string;
  totalVc: number;
  totalRp: number;
  status: string;
  hasError: boolean;
  vendor?: string;
  charge?: number | string;
  [key: string]: any;
}
