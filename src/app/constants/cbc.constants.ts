import { BillingTableColumn } from '../interface/cbc.Interfrace';

export const COMMON_BILLING_COLUMNS: BillingTableColumn[] = [
  {
    columnName: 'Select',
    columnKey: 'select',
    key: 'id',
    templateId: 'select',
    headerTemplateId: 'select',
    headerClass: 'select-column',
    cellClass: 'select-column',
    positionOrder: 0
  },
  {
    columnName: 'Order Details',
    columnKey: 'orderDetails',
    templateId: 'orderDetails',
    field: 'orderNumber',
    dateField: 'orderDate',
    timeField: 'orderTime',
    cellClass: 'order-details-column',
    positionOrder: 1
  },
  {
    columnName: 'Reseller Details',
    columnKey: 'resellerDetails',
    templateId: 'resellerDetails',
    field: 'reseller',
    secondaryField: 'resellerId',
    cellClass: 'reseller-details-column',
    positionOrder: 2
  },
  {
    columnName: 'Invoice ID',
    columnKey: 'invoiceId',
    templateId: 'text',
    field: 'invoiceId',
    positionOrder: 3
  },
  {
    columnName: 'Cs',
    columnKey: 'customerType',
    templateId: 'customerType',
    field: 'customerType',
    prefix: 'ERP',
    positionOrder: 4
  },
  {
    columnName: 'Country',
    columnKey: 'country',
    templateId: 'text',
    field: 'country',
    positionOrder: 5
  },
  {
    columnName: 'Fx',
    columnKey: 'currency',
    templateId: 'text',
    field: 'currency',
    positionOrder: 6
  },
  {
    columnName: 'Total VC',
    columnKey: 'totalVc',
    templateId: 'money',
    field: 'totalVc',
    positionOrder: 7
  },
  {
    columnName: 'Total RP',
    columnKey: 'totalRp',
    templateId: 'money',
    field: 'totalRp',
    positionOrder: 8
  },
  {
    columnName: 'Actions',
    columnKey: 'actions',
    templateId: 'actions',
    cellClass: 'actions-column',
    positionOrder: 9
  }
];