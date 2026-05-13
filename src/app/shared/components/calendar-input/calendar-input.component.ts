import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-calendar-input',
  imports: [FormField],
  templateUrl: './calendar-input.component.html',
  styleUrl: './calendar-input.component.scss'
})
export class CalendarInputComponent {
  label = input.required<string>();
  field = input.required<FieldTree<string>>();

  id = input<string>('');

  firstError = computed(() => {
    const state = this.field()();

    if (!state.touched() || !state.invalid()) {
      return '';
    }

    return state.errors()[0]?.message ?? 'Campo non valido';
  });
}