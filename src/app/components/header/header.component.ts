import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  productName = 'Cloud billing connector';
  readonly userName = 'Nick';
  menuOpen = false;
  

  toggleProductMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeProductMenu(): void {
    this.menuOpen = false;
  }
}