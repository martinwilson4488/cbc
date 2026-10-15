import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { BillingRecord } from '../../models/billing.model';

interface TableColumn {
  key: string;
  label: string;
}

interface TableAction {
  type: string;
  label: string;
  title: string;
  ariaLabel: string;
  iconSrc: string;
}

@Component({
  selector: 'app-billing-table',
  templateUrl: './billing-table.component.html',
  styleUrls: ['./billing-table.component.css']
})
export class BillingTableComponent implements OnChanges {
  @Input() records: BillingRecord[] = [];
  @Input() selectedIds = new Set<number>();

  @Output() selectedIdsChange =
    new EventEmitter<Set<number>>();

  @Output() action =
    new EventEmitter<{ type: string; record: BillingRecord }>();

  // Dynamic table configuration
  columns: TableColumn[] = [
    { key: 'select', label: 'Select' },
    { key: 'orderDetails', label: 'Order Details' },
    { key: 'resellerDetails', label: 'Reseller Details' },
    { key: 'invoiceId', label: 'Invoice ID' },
    { key: 'customerType', label: 'Cs' },
    { key: 'country', label: 'Country' },
    { key: 'currency', label: 'Fx' },
    { key: 'totalVc', label: 'Total VC' },
    { key: 'totalRp', label: 'Total RP' },
    { key: 'actions', label: 'Actions' }
  ];

  displayedColumns: string[] =
    this.columns.map(column => column.key);

  tableConfig = {
    ariaLabel: 'Billing records',
    selectAllLabel: 'Select all billing records',
    selectRowLabel: 'Select',
    deleteLabel: 'Delete',
    approveLabel: 'Approve',
    moreActionsLabel: 'More actions',
    uploadCsvLabel: 'Upload CSV',
    emptyMessage:
      'No billing records found for the selected criteria.',
    csvAccept: '.csv,text/csv',
    dateFormat: 'dd MMM, yyyy',
    erpLabel: 'ERP'
  };

  rowActions: TableAction[] = [
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

  menuActions = [
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

  ngOnChanges(_changes: SimpleChanges): void {}

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  toggle(record: BillingRecord): void {
    const next = new Set(this.selectedIds);

    next.has(record.id)
      ? next.delete(record.id)
      : next.add(record.id);

    this.selectedIdsChange.emit(next);
  }

  toggleAll(): void {
    const next = new Set(this.selectedIds);
    const all = this.allSelected();

    this.records.forEach(row => {
      all ? next.delete(row.id) : next.add(row.id);
    });

    this.selectedIdsChange.emit(next);
  }

  allSelected(): boolean {
    return this.records.length > 0 &&
      this.records.every(row => this.selectedIds.has(row.id));
  }

  someSelected(): boolean {
    return this.records.some(row => this.selectedIds.has(row.id)) &&
      !this.allSelected();
  }

  setActiveRow(record: BillingRecord): void {
    this.activeRecord = record;
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
    if (!this.activeRecord) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.action.emit({
        type: 'upload-csv',
        record: this.activeRecord
      });
    }

    input.value = '';
  }

  emitAction(type: string, record: BillingRecord): void {
    this.action.emit({ type, record });
  }

  selectRowLabel(row: BillingRecord): string {
    return `${this.tableConfig.selectRowLabel} ${row.orderNumber}`;
  }

  money(value: number): string {
    return Number(value || 0).toFixed(2);
  }
}
