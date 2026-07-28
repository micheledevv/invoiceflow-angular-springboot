import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly _isLoading = signal(false);
  private readonly _messageLoader = signal('Caricamento...');

  readonly isLoading = this._isLoading.asReadonly();
  readonly messageLoader = this._messageLoader.asReadonly();

  show(message = 'Caricamento...'): void {
    this._messageLoader.set(message);
    this._isLoading.set(true);
  }

  hide(): void {
    this._isLoading.set(false);
  }

}