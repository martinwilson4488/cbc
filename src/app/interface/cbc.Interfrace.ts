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

export interface BillingTableColumn {
  columnName: string;
  columnKey: string;
  templateId: string;
  positionOrder: number;
  key?: string;
  field?: string;
  secondaryField?: string;
  dateField?: string;
  timeField?: string;
  headerTemplateId?: string;
  headerClass?: string;
  cellClass?: string;
  dateFormat?: string;
  prefix?: string;
}

export interface BillingTableAction {
  type: string;
  label: string;
  iconSrc: string;
  title?: string;
  ariaLabel?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DownloadTabConfig {
  id: string;
  label: string;
  templateType: 'statuses' | 'negativeCharges';
}