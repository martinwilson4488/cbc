import { Component, EventEmitter, HostListener, Output } from '@angular/core';

interface CalendarDay {
  key: string;
  day: number;
  currentMonth: boolean;
}

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent {
  @Output() rangeChange = new EventEmitter<{ start: string; end: string }>();

  // Empty values mean: show all records on first load.
  start = '';
  end = '';

  fromOpen = false;
  toOpen = false;
  fromMonth = new Date();
  toMonth = new Date();
  fromDays: CalendarDay[] = [];
  toDays: CalendarDay[] = [];

  constructor() {
    this.fromMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.toMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.buildCalendars();
  }

  get fromDisplay(): string { return this.start ? this.formatDisplay(this.start) : 'From'; }
  get toDisplay(): string { return this.end ? this.formatDisplay(this.end) : 'To'; }

  toggleFrom(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.toOpen = false;
    this.fromOpen = !this.fromOpen;
    if (this.fromOpen) {
      const base = this.parseDate(this.start) || new Date();
      this.fromMonth = new Date(base.getFullYear(), base.getMonth(), 1);
      this.buildCalendars();
    }
  }

  toggleTo(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.fromOpen = false;
    this.toOpen = !this.toOpen;
    if (this.toOpen) {
      const base = this.parseDate(this.end) || this.parseDate(this.start) || new Date();
      this.toMonth = new Date(base.getFullYear(), base.getMonth(), 1);
      this.buildCalendars();
    }
  }

  closeCalendars(): void { this.fromOpen = false; this.toOpen = false; }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.date-range-picker')) this.closeCalendars();
  }

  previousFrom(event: MouseEvent): void {
    event.stopPropagation();
    this.fromMonth = new Date(this.fromMonth.getFullYear(), this.fromMonth.getMonth() - 1, 1);
    this.buildCalendars();
  }
  nextFrom(event: MouseEvent): void {
    event.stopPropagation();
    this.fromMonth = new Date(this.fromMonth.getFullYear(), this.fromMonth.getMonth() + 1, 1);
    this.buildCalendars();
  }
  previousTo(event: MouseEvent): void {
    event.stopPropagation();
    this.toMonth = new Date(this.toMonth.getFullYear(), this.toMonth.getMonth() - 1, 1);
    this.buildCalendars();
  }
  nextTo(event: MouseEvent): void {
    event.stopPropagation();
    this.toMonth = new Date(this.toMonth.getFullYear(), this.toMonth.getMonth() + 1, 1);
    this.buildCalendars();
  }

  selectFrom(day: CalendarDay, event: MouseEvent): void {
    event.stopPropagation();
    this.start = day.key;
    if (this.end && this.end < this.start) this.end = '';
    this.fromOpen = false;
    this.toOpen = true;
    const date = this.parseDate(this.start) || new Date();
    this.toMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    this.buildCalendars();
    this.emitRange();
  }

  selectTo(day: CalendarDay, event: MouseEvent): void {
    event.stopPropagation();
    if (this.start && day.key < this.start) {
      this.end = this.start;
      this.start = day.key;
    } else {
      this.end = day.key;
    }
    this.toOpen = false;
    this.emitRange();
    this.buildCalendars();
  }

  isFrom(day: CalendarDay): boolean { return day.key === this.start; }
  isTo(day: CalendarDay): boolean { return day.key === this.end; }
  isInRange(day: CalendarDay): boolean {
    return !!this.start && !!this.end && day.key >= this.start && day.key <= this.end;
  }

  get fromTitle(): string { return this.monthTitle(this.fromMonth); }
  get toTitle(): string { return this.monthTitle(this.toMonth); }

  formatDisplay(value: string): string {
    const date = this.parseDate(value);
    if (!date) return '';
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }

  private emitRange(): void {
    this.rangeChange.emit({ start: this.start, end: this.end });
  }

  private buildCalendars(): void {
    this.fromDays = this.buildCalendar(this.fromMonth);
    this.toDays = this.buildCalendar(this.toMonth);
  }

  private buildCalendar(monthDate: Date): CalendarDay[] {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const previousDays = new Date(year, month, 0).getDate();
    const days: CalendarDay[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, previousDays - i);
      days.push(this.toCalendarDay(date, false));
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(this.toCalendarDay(new Date(year, month, day), true));
    }
    let nextDay = 1;
    while (days.length < 42) {
      days.push(this.toCalendarDay(new Date(year, month + 1, nextDay++), false));
    }
    return days;
  }

  private toCalendarDay(date: Date, currentMonth: boolean): CalendarDay {
    return { key: this.toKey(date), day: date.getDate(), currentMonth };
  }
  private toKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  private parseDate(value: string): Date | null {
    if (!value) return null;
    const parts = value.split('-').map(Number);
    return parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : null;
  }
  private monthTitle(date: Date): string {
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }
}
