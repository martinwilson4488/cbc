# Angular 15 – Reusable Billing List

A reusable Angular 15 implementation based on the supplied Cloud Billing Connector screenshots.

## Included
- Angular 15.2.x project.
- Reusable `DateRangeComponent`, `SearchBarComponent`, `ActionButtonComponent`, `BillingTableComponent`, and `PaginationComponent`.
- Billing data loaded from `src/assets/billing-data.json`.
- Start/end date range filtering.
- Search across billing fields.
- Billing List / Approved / Completed / Declined tabs.
- Add Filters and Map SKU are intentionally dummy buttons.
- Pagination is calculated from filtered data.
- Items per page: 5, 10, 20, 50.
- Row selection and select-all for the current page.
- Delete/Approve/More and CSV Download actions are dummy handlers ready to connect to APIs.

## Run

Requirements: Node.js compatible with Angular 15 (Node 14.20+, 16.13+, or 18.10+ is recommended).

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Data

Edit `src/assets/billing-data.json` to add/change records. The table, filtering and pagination use that data automatically.

## Reusable component structure

```text
src/app/
├── components/
│   ├── action-button/
│   ├── billing-table/
│   ├── date-range/
│   ├── pagination/
│   └── search-bar/
├── models/
│   └── billing.model.ts
├── app.component.*
└── app.module.ts
```
