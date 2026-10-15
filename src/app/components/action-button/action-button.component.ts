import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() iconSrc = '';
  @Input() title = '';
  @Input() ariaLabel = '';
  @Input() disabled = false;
  @Input() active = false;

  @Input()
  variant:
    | 'profile'
    | 'outline'
    | 'link'
    | 'icon'
    | 'menu'
    | 'dropdown'
    | 'page' = 'outline';

  @Output() clicked = new EventEmitter<void>();
}