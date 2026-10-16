import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BillingRecord } from './models/billing.model';
import { SidePanelTab } from './components/side-panal/side-panal.component';

interface SelectOption {
  label: string;
  value: string;
}

interface DownloadStatus extends SelectOption {}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Billing data
  allRecords: BillingRecord[] = [];
  filteredRecords: BillingRecord[] = [];
  visibleRecords: BillingRecord[] = [];

  selectedIds = new Set<number>();

  // Page configuration
  readonly uiConfig = {
    filtersButtonLabel: 'Add Filters',
    filtersButtonVariant: 'outline' as const,
    mapSkuButtonLabel: 'Map SKU',
    mapSkuButtonVariant: 'link' as const,
    downloadButtonLabel: 'Download',
    downloadButtonVariant: 'icon' as const,
    downloadIcon: 'assets/images/download.svg',
    selectedLabel: 'selected',
    clearLabel: 'Clear'
  };

  // Billing tabs
  readonly billingTabs: SelectOption[] = [
    { label: 'Billing List', value: 'Billing List' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Declined', value: 'Declined' }
  ];

  activeTab: BillingRecord['status'] = 'Billing List';

  // Search and date filters
  searchTerm = '';
  startDate = '';
  endDate = '';

  // Pagination
  page = 1;
  pageSize = 10;

  // Download panel configuration
  isDownloadPanelOpen = false;
  activeDownloadTab = 'all';

  readonly downloadPanelConfig = {
    title: 'Download',
    actionLabel: 'Download',
    countryLabel: 'Country',
    countryPlaceholder: 'Choose Country',
    vendorLabel: 'Vendor',
    vendorPlaceholder: 'Choose Vendor',
    vendorHelp: 'Select one or more vendors.',
    negativeChargesHelp:
      'Please select only one country and one or more vendor(s) to download the negative charges data.',
    tabs: [
      { id: 'all', label: 'All' },
      { id: 'negative-charges', label: 'Negative Charges' }
    ] as SidePanelTab[]
  };

  readonly availableStatuses: DownloadStatus[] = [
    { label: 'Pending List', value: 'Billing List' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Declined', value: 'Declined' },
    { label: 'Completed', value: 'Completed' }
  ];

  // Replace these sample options with values returned by your API.
  countries: SelectOption[] = [
    { label: 'India', value: 'India' },
    { label: 'United States', value: 'United States' },
    { label: 'United Kingdom', value: 'United Kingdom' }
  ];

  vendors: SelectOption[] = [
    { label: 'Vendor A', value: 'Vendor A' },
    { label: 'Vendor B', value: 'Vendor B' },
    { label: 'Vendor C', value: 'Vendor C' }
  ];

  selectedStatuses = new Set<string>();
  selectedCountry = '';
  selectedVendors: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<BillingRecord[]>('assets/billing-data.json')
      .subscribe({
        next: data => {
          this.allRecords = data;
          this.applyFilters();
        },
        error: error => {
          console.error('Failed to load billing records: - app.component.ts:113', error);
          this.allRecords = [];
          this.applyFilters();
        }
      });
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  get allStatusesSelected(): boolean {
    return this.availableStatuses.length > 0 &&
      this.availableStatuses.every(status =>
        this.selectedStatuses.has(status.value)
      );
  }

  get someStatusesSelected(): boolean {
    return this.selectedStatuses.size > 0 &&
      !this.allStatusesSelected;
  }

  get canDownload(): boolean {
    if (this.activeDownloadTab === 'all') {
      return this.selectedStatuses.size > 0;
    }

    return !!this.selectedCountry &&
      this.selectedVendors.length > 0;
  }

  // Selection
  onSelectedIdsChange(ids: Set<number>): void {
    this.selectedIds = new Set(ids);
  }

  clearSelection(): void {
    this.selectedIds = new Set<number>();
  }

  // Billing tabs
  setTab(tab: string): void {
    this.activeTab = tab as BillingRecord['status'];
    this.page = 1;
    this.clearSelection();
    this.applyFilters();
  }

  // Search
  onSearch(term: string): void {
    this.searchTerm = term;
    this.page = 1;
    this.applyFilters();
  }

  // Date range
  onDateRange(range: { start: string; end: string }): void {
    this.startDate = range.start;
    this.endDate = range.end;
    this.page = 1;
    this.applyFilters();
  }

  // Apply billing tab, search, and date filters
  applyFilters(): void {
    const search = this.searchTerm.trim().toLowerCase();

    this.filteredRecords = this.allRecords.filter(row => {
      const matchesTab = row.status === this.activeTab;

      const matchesSearch =
        !search ||
        Object.values(row).some(value =>
          String(value ?? '').toLowerCase().includes(search)
        );

      const matchesDate =
        (!this.startDate || row.orderDate >= this.startDate) &&
        (!this.endDate || row.orderDate <= this.endDate);

      return matchesTab && matchesSearch && matchesDate;
    });

    this.refreshPage();
  }

  // Pagination
  refreshPage(): void {
    const totalPages = Math.max(
      1,
      Math.ceil(this.filteredRecords.length / this.pageSize)
    );

    if (this.page > totalPages) {
      this.page = totalPages;
    }

    const start = (this.page - 1) * this.pageSize;

    this.visibleRecords = this.filteredRecords.slice(
      start,
      start + this.pageSize
    );
  }

  changePage(page: number): void {
    this.page = page;
    this.refreshPage();
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.page = 1;
    this.refreshPage();
  }

  // Download panel
  openDownloadPanel(): void {
    this.isDownloadPanelOpen = true;
  }

  closeDownloadPanel(): void {
    this.isDownloadPanelOpen = false;
  }

  onDownloadTabChange(tabId: string): void {
    this.activeDownloadTab = tabId;
  }

  // Status checkboxes
  toggleStatus(value: string, checked: boolean): void {
    const updated = new Set(this.selectedStatuses);

    if (checked) {
      updated.add(value);
    } else {
      updated.delete(value);
    }

    this.selectedStatuses = updated;
  }

  toggleAllStatuses(checked: boolean): void {
    this.selectedStatuses = checked
      ? new Set(this.availableStatuses.map(status => status.value))
      : new Set<string>();
  }

  // Country and vendor selection
  onCountryChange(country: string): void {
    this.selectedCountry = country;
    this.selectedVendors = [];
  }

  // Download action
  downloadSelectedStatuses(): void {
    if (!this.canDownload) {
      return;
    }

    if (this.activeDownloadTab === 'all') {
      const recordsToDownload = this.allRecords.filter(record =>
        this.selectedStatuses.has(String(record.status))
      );

      // Connect recordsToDownload to your existing CSV export service.
      console.log('Records selected for export: - app.component.ts:280', recordsToDownload);
    } else {
      // Connect these selections to your negative charges export service.
      console.log('Selected country: - app.component.ts:283', this.selectedCountry);
      console.log('Selected vendors: - app.component.ts:284', this.selectedVendors);
    }

    this.closeDownloadPanel();
  }
}