import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() variant: 'outline' | 'link' = 'outline';
  @Output() clicked = new EventEmitter<void>();
}
