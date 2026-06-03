import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-select-input',
  imports: [FormField],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent {
  label = input.required<string>();
  isRequired = input<boolean>();
  field = input.required<FieldTree<string>>();

  id = input<string>('');
  options = input<SelectOption<string>[]>([]);

  firstError = computed(() => {
    const state = this.field()();

    if (!state.touched() || !state.invalid()) {
      return '';
    }

    return state.errors()[0]?.message ?? 'Campo non valido';
  });
}