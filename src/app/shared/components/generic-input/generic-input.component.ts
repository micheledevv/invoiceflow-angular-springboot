import { Component, computed, input, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-generic-input',
  imports: [FormField],
  templateUrl: './generic-input.component.html',
  styleUrl: './generic-input.component.scss'
})
export class GenericInputComponent {
  label = input.required<string>();
  field = input.required<FieldTree<string>>();

  isRequired = input<boolean>(false);
  type = input<string>('text');
  id = input<string>('');
  placeholder = input<string>('');
  labelIsVisible = input<boolean>(true);

  onlyNumbers = input<boolean>(false);
  maxInputLength = input<number | null>(null);

  private manualError = signal<string>('');

  firstError = computed(() => {
    const state = this.field()();

    if (this.manualError()) {
      return this.manualError();
    }

    if (!state.touched() || !state.invalid()) {
      return '';
    }

    return state.errors()[0]?.message ?? 'Campo non valido';
  });

  protected blockInvalidInput(event: InputEvent): void {
    if (!this.onlyNumbers()) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const value = event.data;

    if (!value) {
      return;
    }

    const isNumber = /^[0-9]+$/.test(value);

    if (!isNumber) {
      event.preventDefault();
      this.showManualError('Non puoi scrivere lettere');
      return;
    }

    const maxLength = this.maxInputLength();

    if (maxLength === null) {
      this.clearManualError();
      return;
    }

    const selectionStart = input.selectionStart ?? input.value.length;
    const selectionEnd = input.selectionEnd ?? input.value.length;

    const nextValue =
      input.value.slice(0, selectionStart) +
      value +
      input.value.slice(selectionEnd);

    if (nextValue.length > maxLength) {
      event.preventDefault();
      this.showManualError(`Massimo ${maxLength} numeri`);
      return;
    }

    this.clearManualError();
  }

  protected blockInvalidPaste(event: ClipboardEvent): void {
    if (!this.onlyNumbers()) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const pastedValue = event.clipboardData?.getData('text') ?? '';

    const isOnlyNumbers = /^[0-9]+$/.test(pastedValue);

    if (!isOnlyNumbers) {
      event.preventDefault();
      this.showManualError('Puoi incollare solo numeri');
      return;
    }

    const maxLength = this.maxInputLength();

    if (maxLength === null) {
      this.clearManualError();
      return;
    }

    const selectionStart = input.selectionStart ?? input.value.length;
    const selectionEnd = input.selectionEnd ?? input.value.length;

    const nextValue =
      input.value.slice(0, selectionStart) +
      pastedValue +
      input.value.slice(selectionEnd);

    if (nextValue.length > maxLength) {
      event.preventDefault();
      this.showManualError(`Massimo ${maxLength} numeri`);
      return;
    }

    this.clearManualError();
  }

  private showManualError(message: string): void {
    this.manualError.set(message);

    setTimeout(() => {
      this.manualError.set('');
    }, 2000);
  }

  private clearManualError(): void {
    this.manualError.set('');
  }
}