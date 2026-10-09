import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() page = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  readonly pageSizes = [5, 10, 20, 50];

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get startItem(): number { return this.totalItems === 0 ? 0 : (this.page - 1) * this.pageSize + 1; }
  get endItem(): number { return Math.min(this.totalItems, this.page * this.pageSize); }
  get pages(): number[] {
    const max = 7;
    if (this.totalPages <= max) return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const result = [1];
    const from = Math.max(2, this.page - 2);
    const to = Math.min(this.totalPages - 1, this.page + 2);
    if (from > 2) result.push(-1);
    for (let p = from; p <= to; p++) result.push(p);
    if (to < this.totalPages - 1) result.push(-1);
    result.push(this.totalPages);
    return result;
  }
  goTo(p: number): void { 
    if (p >= 1 && p <= this.totalPages && p !== this.page) this.pageChange.emit(p); 
  }
  changeSize(size: string): void { 
    this.pageSizeChange.emit(Number(size)); 
  }
}
