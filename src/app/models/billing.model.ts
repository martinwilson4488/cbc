export interface BillingRecord {
  id: number;
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
  status: 'Billing List' | 'Approved' | 'Completed' | 'Declined';
  hasError: boolean;
}
