import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-generic-input',
  imports: [],
  templateUrl: './generic-input.component.html',
  styleUrl: './generic-input.component.scss'
})
export class GenericInputComponent {
  label = input.required<string>();

  value = input<string>('');
  type = input<string>('text');
  id = input<string>('');
  placeholder = input<string>('');
  error = input<string>('');

  valueChange = output<string>();

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}