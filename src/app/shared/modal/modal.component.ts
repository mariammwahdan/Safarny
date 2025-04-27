import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [NgIf]
})
export class ModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  ngOnChanges() {
    if (this.show) {
      document.body.style.overflow = 'hidden'; // 🚫 disable scroll
    } else {
      document.body.style.overflow = '';        // ✅ enable scroll
    }
  }

  onClose() {
    this.close.emit();
  }
}
