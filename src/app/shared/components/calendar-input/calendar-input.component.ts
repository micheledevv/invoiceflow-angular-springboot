import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-calendar-input',
  imports: [],
  templateUrl: './calendar-input.component.html',
  styleUrl: './calendar-input.component.scss'
})
export class CalendarInputComponent {
  label = input.required<string>();

  value = input<string>('');
  id = input<string>('');
  error = input<string>('');

  valueChange = output<string>();

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}