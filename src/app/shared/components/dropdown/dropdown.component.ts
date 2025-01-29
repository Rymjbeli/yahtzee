import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface Option {
  value: string;
  label: string;
}
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input() options: Option[] = []; // List of options
  @Input() placeholder: string = "";
  @Input() disabled: boolean = false; // Disable dropdown
  @Input() leftIcon: boolean = false;
  @Input() rightIcon: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() changeSelected: boolean = true;
  @Output() selectionChange = new EventEmitter<Option>(); // Emits the selected value

  isOpen: boolean = false; // Tracks dropdown state
  selectedOption: Option | null = null; // Tracks the current selection

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: Option): void {
    if (this.changeSelected) this.selectedOption = option;
    this.isOpen = false;
    this.selectionChange.emit(option); // Emit the selected option
  }
}
