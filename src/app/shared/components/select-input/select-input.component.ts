import { Component, input, output } from '@angular/core';

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-select-input',
  imports: [],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent {
  label = input.required<string>();

  value = input<string | number>('');
  id = input<string>('');
  error = input<string>('');
  options = input<SelectOption[]>([]);

  valueChange = output<string | number>();

  onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;

    const option = this.options().find(option => String(option.value) === selectedValue);

    this.valueChange.emit(option?.value ?? selectedValue);
  }
}