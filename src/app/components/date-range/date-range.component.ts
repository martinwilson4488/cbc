import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent {
  @Output() rangeChange = new EventEmitter<{ start: string; end: string }>();

  // Empty by default so the table shows all records on initial load.
  start: Date | null = null;
  end: Date | null = null;

  onFromChange(value: Date | null): void {
    this.start = value;
    if (this.start && this.end && this.start > this.end) {
      this.end = null;
    }
    this.emitRange();
  }

  onToChange(value: Date | null): void {
    this.end = value;
    if (this.start && this.end && this.end < this.start) {
      this.start = this.end;
    }
    this.emitRange();
  }

  private emitRange(): void {
    this.rangeChange.emit({
      start: this.start ? this.toDateKey(this.start) : '',
      end: this.end ? this.toDateKey(this.end) : ''
    });
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
