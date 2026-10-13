import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BillingRecord } from './models/billing.model';

@Component({ 
  selector: 'app-root', 
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css'] 
})

export class AppComponent implements OnInit {
  allRecords: BillingRecord[] = [];
  filteredRecords: BillingRecord[] = [];
  visibleRecords: BillingRecord[] = [];
  selectedIds = new Set<number>();
  activeTab: BillingRecord['status'] = 'Billing List';
  searchTerm = '';
  startDate = '';
  endDate = '';
  page = 1;
  pageSize = 10;
  filterOpen = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<BillingRecord[]>('assets/billing-data.json').subscribe(data => {
      this.allRecords = data;
      this.applyFilters();
    });
  }

  get selectedCount(): number { return this.selectedIds.size; }

  clearSelection(): void {
    this.selectedIds = new Set<number>();
  }

  setTab(tab: BillingRecord['status']): void { 
    this.activeTab = tab; 
    this.page = 1; 
    this.applyFilters(); 
  }

  onSearch(term: string): void { 
    this.searchTerm = term; 
    this.page = 1; 
    this.applyFilters(); 
  }

  onDateRange(range: { start: string; end: string }): void {
    this.startDate = range.start; 
    this.endDate = range.end; 
    this.page = 1; 
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredRecords = this.allRecords.filter(row => {
      const matchesTab = row.status === this.activeTab;
      const matchesSearch = !search || Object.values(row).some(value => String(value).toLowerCase().includes(search));
      const matchesDate = (!this.startDate || row.orderDate >= this.startDate) && (!this.endDate || row.orderDate <= this.endDate);
      return matchesTab && matchesSearch && matchesDate;
    });
    this.refreshPage();
  }

  refreshPage(): void {
    const totalPages = Math.max(1, Math.ceil(this.filteredRecords.length / this.pageSize));
    if (this.page > totalPages) this.page = totalPages;
    const start = (this.page - 1) * this.pageSize;
    this.visibleRecords = this.filteredRecords.slice(start, start + this.pageSize);
  }

  changePage(page: number): void { 
    this.page = page; 
    this.refreshPage(); }

  changePageSize(size: number): void { 
    this.pageSize = size; 
    this.page = 1; 
    this.refreshPage(); 
  }

  toggleFilter(): void { 
    this.filterOpen = !this.filterOpen; 
  }
}
