
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { BillingRecord } from './models/billing.model';

export interface SelectOption {
  label: string;
  value: string;
}

export interface DownloadTabConfig {
  id: string;
  label: string;
  templateType: 'statuses' | 'negativeCharges';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  // Page configuration
uiConfig = {
  pageTitle: 'Cloud Billing',
  downloadButtonLabel: 'Download CSV',
  searchPlaceholder: 'Search billing records',
  noRecordsMessage: 'No records found.',

  filtersButtonLabel: 'Filters',
  filtersButtonVariant: 'outline',

  mapSkuButtonLabel: 'Map SKU',
  mapSkuButtonVariant: 'outline'
};

  // Download panel configuration
  downloadPanelConfig = {
    title: 'Download',
    primaryActionLabel: 'Download',
    negativeChargesHelp:
      'Please select one country and one vendor to download negative charges data.',
    countryLabel: 'Country',
    countryPlaceholder: 'Choose Country',
    vendorLabel: 'Vendor',
    vendorPlaceholder: 'Choose Vendor',
    tabs: [
      {
        id: 'all',
        label: 'All',
        templateType: 'statuses'
      },
      {
        id: 'negative-charges',
        label: 'Negative Charges',
        templateType: 'negativeCharges'
      }
    ] as DownloadTabConfig[]
  };

  // Billing tabs
  billingTabs: SelectOption[] = [
    { label: 'Pending List', value: 'Billing List' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Declined', value: 'Declined' },
    { label: 'Completed', value: 'Completed' }
  ];

  // Status options for CSV download
  availableStatuses: SelectOption[] = [
    { label: 'Pending List', value: 'Billing List' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Declined', value: 'Declined' },
    { label: 'Completed', value: 'Completed' }
  ];

  // Sample options; replace with actual application data if available
  countryOptions: SelectOption[] = [
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'India', value: 'IN' }
  ];

  vendorOptions: SelectOption[] = [
    { label: 'Vendor A', value: 'Vendor A' },
    { label: 'Vendor B', value: 'Vendor B' },
    { label: 'Vendor C', value: 'Vendor C' }
  ];

  // Billing data
  billingData: BillingRecord[] = [];
  filteredData: BillingRecord[] = [];
  paginatedData: BillingRecord[] = [];

  // Filters
  activeTab = 'Billing List';
  searchText = '';
  startDate = '';
  endDate = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Must match BillingTableComponent's Set-based selection
  selectedIds = new Set<number | string>();

  // Download panel state
  downloadPanelVisible = false;
  activeDownloadTab = '';
  selectedStatuses = new Set<string>();

  // Single-select country and vendor form
  negativeChargesForm: FormGroup = this.fb.group({
    country: ['', Validators.required],
    vendor: ['', Validators.required]
  });

  // Resolve active panel content from configuration
  get activeDownloadTabConfig(): DownloadTabConfig | undefined {
    return this.downloadPanelConfig.tabs.find(
      tab => tab.id === this.activeDownloadTab
    );
  }

  // Enable download based on the selected content type
  get canDownload(): boolean {
    const config = this.activeDownloadTabConfig;

    if (!config) {
      return false;
    }

    switch (config.templateType) {
      case 'statuses':
        return this.selectedStatuses.size > 0;

      case 'negativeCharges':
        return this.negativeChargesForm.valid;

      default:
        return false;
    }
  }

  ngOnInit(): void {
    this.activeDownloadTab =
      this.downloadPanelConfig.tabs[0]?.id ?? '';

    this.loadBillingData();
  }

  // Load billing data
  loadBillingData(): void {
    this.http
      .get<BillingRecord[]>('assets/billing-data.json')
      .subscribe({
        next: data => {
          this.billingData = data;
          this.applyFilters();
        },
        error: error => {
          console.error('Unable to load billing data: - app.component.ts:174', error);
          this.billingData = [];
          this.applyFilters();
        }
      });
  }

  // Billing tab selection
  setTab(status: string): void {
    this.activeTab = status;
    this.currentPage = 1;
    this.clearSelection();
    this.applyFilters();
  }

  // Search
  onSearchChange(value: string): void {
    this.searchText = value;
    this.currentPage = 1;
    this.applyFilters();
  }

  // Date range
  onDateRangeChange(range: {
    startDate: string;
    endDate: string;
  }): void {
    this.startDate = range.startDate;
    this.endDate = range.endDate;
    this.currentPage = 1;
    this.applyFilters();
  }

  // Apply billing filters
  applyFilters(): void {
    let result = [...this.billingData];

    result = result.filter(
      record => record.status === this.activeTab
    );

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();

      result = result.filter(record =>
        Object.values(record).some(value =>
          String(value ?? '').toLowerCase().includes(search)
        )
      );
    }

    if (this.startDate) {
      result = result.filter(
        record =>
          !!record.orderDate &&
          record.orderDate >= this.startDate
      );
    }

    if (this.endDate) {
      result = result.filter(
        record =>
          !!record.orderDate &&
          record.orderDate <= this.endDate
      );
    }

    this.filteredData = result;
    this.updatePagination();
  }

  // Pagination
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    this.paginatedData = this.filteredData.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagination();
  }

  // Table selection
  onSelectionChange(ids: Set<number | string>): void {
    this.selectedIds = new Set(ids);
  }

  clearSelection(): void {
    this.selectedIds = new Set<number | string>();
  }

  // Download panel controls
  openDownloadPanel(): void {
    this.downloadPanelVisible = true;
  }

  closeDownloadPanel(): void {
    this.downloadPanelVisible = false;
  }

  onDownloadTabChange(tabId: string): void {
    this.activeDownloadTab = tabId;
  }

  // Status checkbox selection
  toggleStatus(status: string, checked: boolean): void {
    const nextStatuses = new Set(this.selectedStatuses);

    if (checked) {
      nextStatuses.add(status);
    } else {
      nextStatuses.delete(status);
    }

    this.selectedStatuses = nextStatuses;
  }

  // Download selected table records
  downloadSelectedRecords(): void {
    if (this.selectedIds.size === 0) {
      return;
    }

    const records = this.billingData.filter(record =>
      this.selectedIds.has(record.id)
    );

    this.exportCsv(records, 'selected-billing-records.csv');
  }

  // Download records for the active panel content
  downloadSelectedStatuses(): void {
    const config = this.activeDownloadTabConfig;

    if (!config || !this.canDownload) {
      return;
    }

    let records: BillingRecord[] = [];

    switch (config.templateType) {
      case 'statuses':
        records = this.billingData.filter(record =>
          this.selectedStatuses.has(record.status)
        );
        break;

      case 'negativeCharges': {
        const country =
          this.negativeChargesForm.get('country')?.value;

        const vendor =
          this.negativeChargesForm.get('vendor')?.value;

        records = this.billingData.filter(record =>
          record.country === country &&
          record.vendor === vendor &&
          Number(record.charge) < 0
        );
        break;
      }
    }

    if (records.length === 0) {
      console.warn('No records found for the selected criteria. - app.component.ts:348');
      return;
    }

    this.exportCsv(records, 'billing-export.csv');
    this.closeDownloadPanel();
  }

  // CSV export
  private exportCsv(
    records: BillingRecord[],
    filename: string
  ): void {
    if (records.length === 0) {
      return;
    }

    const headers = Object.keys(records[0]);

    const escapeCsvValue = (value: unknown): string => {
      const text = String(value ?? '');
      return `"${text.replace(/"/g, '""')}"`;
    };

    const csvRows = [
      headers.map(escapeCsvValue).join(','),
      ...records.map(record =>
        headers
          .map(header => escapeCsvValue(record[header]))
          .join(',')
      )
    ];

    const blob = new Blob(
      ['\uFEFF' + csvRows.join('\r\n')],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    URL.revokeObjectURL(url);
  }
}
