import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

export interface SidePanelTab {
  id: string;
  label: string;
}

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panal.component.html',
  styleUrls: ['./side-panal.component.css']
})
export class SidePanelComponent {
  @Input() visible = false;
  @Input() title = 'Panel';
  @Input() width = '345px';

  @Input() tabs: SidePanelTab[] = [];
  @Input() activeTab = '';

  @Input() showFooter = true;
  @Input() primaryActionLabel = 'Submit';
  @Input() primaryActionDisabled = false;

  @Output() closed = new EventEmitter<void>();
  @Output() activeTabChange = new EventEmitter<string>();
  @Output() primaryAction = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
    this.activeTabChange.emit(tabId);
  }

  submit(): void {
    if (!this.primaryActionDisabled) {
      this.primaryAction.emit();
    }
  }
}