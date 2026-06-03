import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-generic-input',
  imports: [FormField],
  templateUrl: './generic-input.component.html',
  styleUrl: './generic-input.component.scss'
})
export class GenericInputComponent {
  label = input.required<string>();
  isRequired= input.required<boolean>();
  field = input.required<FieldTree<string>>();

  type = input<string>('text');
  id = input<string>('');
  placeholder = input<string>('');
  labelIsVisible = input<boolean>(true);

  firstError = computed(() => {
    const state = this.field()();

    if (!state.touched() || !state.invalid()) {
      return '';
    }

    return state.errors()[0]?.message ?? 'Campo non valido';
  });
}