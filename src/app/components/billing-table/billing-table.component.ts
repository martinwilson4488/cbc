
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { BillingRecord } from '../../models/billing.model';


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

@Component({
  selector: 'app-billing-table',
  templateUrl: './billing-table.component.html',
  styleUrls: ['./billing-table.component.css']
})
export class BillingTableComponent {

  // Inputs used by the parent component
  @Input() data: BillingRecord[] = [];  
  @Input() selectedIds = new Set<number | string>();

  // Output used by the parent component
  @Output() selectionChange =
    new EventEmitter<Set<number | string>>();

  @Output() action = new EventEmitter<{
    type: string;
    record: BillingRecord;
    file?: File;
  }>();

  @ViewChild('textHeader', { static: true })
  textHeader!: TemplateRef<unknown>;

  @ViewChild('selectHeader', { static: true })
  selectHeader!: TemplateRef<unknown>;

  @ViewChild('selectCell', { static: true })
  selectCell!: TemplateRef<unknown>;

  @ViewChild('textCell', { static: true })
  textCell!: TemplateRef<unknown>;

  @ViewChild('dateCell', { static: true })
  dateCell!: TemplateRef<unknown>;

  @ViewChild('moneyCell', { static: true })
  moneyCell!: TemplateRef<unknown>;

  @ViewChild('orderDetailsCell', { static: true })
  orderDetailsCell!: TemplateRef<unknown>;

  @ViewChild('resellerDetailsCell', { static: true })
  resellerDetailsCell!: TemplateRef<unknown>;

  @ViewChild('customerTypeCell', { static: true })
  customerTypeCell!: TemplateRef<unknown>;

  @ViewChild('actionsCell', { static: true })
  actionsCell!: TemplateRef<unknown>;

  columns: BillingTableColumn[] = [
    ...COMMON_BILLING_COLUMNS
  ];

  tableConfig = {
    ariaLabel: 'Billing records',
    selectAllLabel: 'Select all billing records',
    selectRowLabel: 'Select',
    moreActionsLabel: 'More actions',
    moreActionsIconSrc: '../../../assets/images/dots.svg',
    emptyMessage: 'No billing records found for the selected criteria.',
    csvAccept: '.csv,text/csv',
    dateFormat: 'dd MMM, yyyy'
  };

  rowActions: BillingTableAction[] = [
    {
      type: 'delete',
      label: 'Delete',
      title: 'Delete',
      ariaLabel: 'Delete row',
      iconSrc: '../../../assets/images/red-close.svg'
    },
    {
      type: 'approve',
      label: 'Approve',
      title: 'Approve',
      ariaLabel: 'Approve row',
      iconSrc: '../../../assets/images/green-tick.svg'
    }
  ];

  menuActions: BillingTableAction[] = [
    {
      type: 'delete',
      label: 'Delete',
      iconSrc: '../../../assets/images/delete-icon.svg'
    },
    {
      type: 'upload-csv',
      label: 'Upload CSV',
      iconSrc: '../../../assets/images/download.svg'
    }
  ];

  activeRecord: BillingRecord | null = null;

  get displayedColumns(): string[] {
    return [...this.columns]
      .sort(
        (first, second) =>
          first.positionOrder - second.positionOrder
      )
      .map(column => column.columnKey);
  }

  get headerTemplateRegistry():
    Record<string, TemplateRef<unknown>> {
    return {
      text: this.textHeader,
      select: this.selectHeader
    };
  }

  get cellTemplateRegistry():
    Record<string, TemplateRef<unknown>> {
    return {
      select: this.selectCell,
      text: this.textCell,
      date: this.dateCell,
      money: this.moneyCell,
      orderDetails: this.orderDetailsCell,
      resellerDetails: this.resellerDetailsCell,
      customerType: this.customerTypeCell,
      actions: this.actionsCell
    };
  }

  getColumnValues(
    record: BillingRecord,
    column: BillingTableColumn
  ): any[] {
    const field =
      column.field || column.key || column.columnKey;

    const primaryValue = this.getValue(record, field);

    if (column.templateId === 'orderDetails') {
      return [
        primaryValue,
        this.getValue(
          record,
          column.dateField || 'orderDate'
        ),
        column.timeField
          ? this.getValue(record, column.timeField)
          : undefined
      ];
    }

    if (column.templateId === 'resellerDetails') {
      return [
        primaryValue,
        column.secondaryField
          ? this.getValue(record, column.secondaryField)
          : undefined
      ];
    }

    return [primaryValue];
  }

  getValue(record: unknown, path: string): any {
    return path.split('.').reduce<any>(
      (value, key) =>
        value == null ? undefined : value[key],
      record
    );
  }

  isSelected(id: number | string): boolean {
    return this.selectedIds.has(id);
  }

  toggle(record: BillingRecord): void {
    const nextSelection = new Set(this.selectedIds);

    if (nextSelection.has(record.id)) {
      nextSelection.delete(record.id);
    } else {
      nextSelection.add(record.id);
    }

    this.selectedIds = nextSelection;
    this.selectionChange.emit(nextSelection);
  }

  toggleAll(): void {
    const nextSelection = new Set(this.selectedIds);
    const shouldDeselect = this.allSelected();

    this.data.forEach(record => {
      if (shouldDeselect) {
        nextSelection.delete(record.id);
      } else {
        nextSelection.add(record.id);
      }
    });

    this.selectedIds = nextSelection;
    this.selectionChange.emit(nextSelection);
  }

  allSelected(): boolean {
    return this.data.length > 0 &&
      this.data.every(
        record => this.selectedIds.has(record.id)
      );
  }

  someSelected(): boolean {
    return this.data.some(
      record => this.selectedIds.has(record.id)
    ) && !this.allSelected();
  }

  selectRowLabel(record: BillingRecord): string {
    return `${this.tableConfig.selectRowLabel} ${record.orderNumber}`;
  }

  setActiveRow(record: BillingRecord): void {
    this.activeRecord = record;
  }

  emitAction(
    type: string,
    record: BillingRecord
  ): void {
    this.action.emit({ type, record });
  }

  emitActiveAction(type: string): void {
    if (this.activeRecord) {
      this.action.emit({
        type,
        record: this.activeRecord
      });
    }
  }

  emitActiveUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (this.activeRecord && file) {
      this.action.emit({
        type: 'upload-csv',
        record: this.activeRecord,
        file
      });
    }

    input.value = '';
  }

  money(value: unknown): string {
    const amount = Number(value ?? 0);

    return Number.isFinite(amount)
      ? amount.toFixed(2)
      : '0.00';
  }

  clearSelection(): void {
    this.selectedIds = new Set<number | string>();
    this.selectionChange.emit(this.selectedIds);
  }
}
