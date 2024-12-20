import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input() options: string[] = []; // List of options
  @Input() placeholder: string = 'Select an option'; // Placeholder text
  @Input() disabled: boolean = false; // Disable dropdown
  @Input() withIcon: boolean = true; // Show dropdown icon
  @Output() selectionChange = new EventEmitter<string>(); // Emits the selected value

  isOpen: boolean = false; // Tracks dropdown state
  selectedOption: string | null = null; // Tracks the current selection

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isOpen = false;
    this.selectionChange.emit(option); // Emit the selected option
  }
}
