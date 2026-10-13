import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { BillingRecord } from '../../models/billing.model';

@Component({
  selector: 'app-billing-table',
  templateUrl: './billing-table.component.html',
  styleUrls: ['./billing-table.component.css']
})
export class BillingTableComponent implements OnChanges {
  @Input() records: BillingRecord[] = [];
  @Input() selectedIds = new Set<number>();
  @Output() selectedIdsChange = new EventEmitter<Set<number>>();
  @Output() action = new EventEmitter<{ type: string; record: BillingRecord }>();

  displayedColumns: string[] = [
    'select', 'orderDetails', 'resellerDetails', 'invoiceId', 'customerType',
    'country', 'currency', 'totalVc', 'totalRp', 'actions'
  ];
  activeRecord: BillingRecord | null = null;

  ngOnChanges(_changes: SimpleChanges): void {
    // MatTable receives the latest records through its dataSource binding.
  }

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  toggle(record: BillingRecord): void {
    const next = new Set(this.selectedIds);
    next.has(record.id) ? next.delete(record.id) : next.add(record.id);
    this.selectedIdsChange.emit(next);
  }

  toggleAll(): void {
    const next = new Set(this.selectedIds);
    const allSelected = this.records.length > 0 && this.records.every(row => next.has(row.id));
    this.records.forEach(row => allSelected ? next.delete(row.id) : next.add(row.id));
    this.selectedIdsChange.emit(next);
  }

  allSelected(): boolean {
    return this.records.length > 0 && this.records.every(row => this.selectedIds.has(row.id));
  }

  someSelected(): boolean {
    return this.records.some(row => this.selectedIds.has(row.id)) && !this.allSelected();
  }

  setActiveRow(record: BillingRecord): void {
    this.activeRecord = record;
  }

  emitActiveAction(type: string): void {
    if (this.activeRecord) {
      this.action.emit({ type, record: this.activeRecord });
    }
  }

  emitActiveUpload(event: Event): void {
    if (!this.activeRecord) return;
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    if (file) {
      this.action.emit({ type: 'upload-csv', record: this.activeRecord });
    }
    input.value = '';
  }

  emitAction(type: string, record: BillingRecord, event?: Event): void {
    if (event) event.stopPropagation();
    this.action.emit({ type, record });
  }

  money(value: number): string {
    return Number(value || 0).toFixed(2);
  }
}
