import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenericModalService {
  private readonly _modalIsOpen = signal(false);
  readonly modalIsOpen = this._modalIsOpen.asReadonly();

  private readonly _title = signal('');
  readonly title = this._title.asReadonly();

  private readonly _description = signal('');
  readonly description = this._description.asReadonly();

  private readonly _confirmResult = new Subject<boolean>();
  readonly confirmResult$ = this._confirmResult.asObservable();

  openModal(title: string, description: string): void {
    this._title.set(title);
    this._description.set(description);
    this._modalIsOpen.set(true);
  }

  confirm(): void {
    this._confirmResult.next(true);
    this.closeModal();
  }

  cancel(): void {
    this._confirmResult.next(false);
    this.closeModal();
  }

  closeModal(): void {
    this._modalIsOpen.set(false);
    this._title.set('');
    this._description.set('');
  }
}