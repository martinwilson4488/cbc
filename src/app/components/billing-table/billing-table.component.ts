import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BillingRecord } from '../../models/billing.model';

@Component({
  selector: 'app-billing-table',
  templateUrl: './billing-table.component.html',
  styleUrls: ['./billing-table.component.css']
})
export class BillingTableComponent {
  @Input() records: BillingRecord[] = [];
  @Input() selectedIds = new Set<number>();
  @Output() selectedIdsChange = new EventEmitter<Set<number>>();
  @Output() action = new EventEmitter<{ type: string; record: BillingRecord }>();
  openMenuId: number | null = null;

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
    const allSelected = this.records.length > 0 && this.records.every(r => next.has(r.id));
    this.records.forEach(r => allSelected ? next.delete(r.id) : next.add(r.id));
    this.selectedIdsChange.emit(next);
  }

  allSelected(): boolean { 
    return this.records.length > 0 && this.records.every(r => this.selectedIds.has(r.id)); 
  }

  someSelected(): boolean { 
    return this.records.some(r => this.selectedIds.has(r.id)) && !this.allSelected(); 
  }

  toggleMenu(record: BillingRecord, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === record.id ? null : record.id;
  }

  money(value: number): string { 
    return value.toFixed(2); 
  }
}
