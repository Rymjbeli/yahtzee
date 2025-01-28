import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() text: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'normal' | 'disabled' = 'normal';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() email: boolean = false;
  @Output() textChange = new EventEmitter<string>();

  onTextChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
    this.textChange.emit(this.text);
  }
}
