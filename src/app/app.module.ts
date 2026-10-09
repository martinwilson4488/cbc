import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { BillingTableComponent } from './components/billing-table/billing-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [AppComponent, DateRangeComponent, SearchBarComponent, ActionButtonComponent, BillingTableComponent, PaginationComponent, HeaderComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
