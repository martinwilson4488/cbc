import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() searchChange = new EventEmitter<string>();
  value = '';
  onInput(): void { this.searchChange.emit(this.value.trim().toLowerCase()); }
}
