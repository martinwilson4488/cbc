import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  productName = 'Cloud Billing Connector';
  readonly userName = 'Nick';
  readonly products = [
    'Cloud Billing Connector'
  ];
  menuOpen = false;

  toggleProductMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  selectProduct(product: string): void {
    this.productName = product;
    this.menuOpen = false;
  }
}
