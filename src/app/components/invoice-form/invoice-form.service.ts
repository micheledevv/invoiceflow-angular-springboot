import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceFormService {
  isFormOpen = signal<boolean>(false);
  mode = signal<'create' | 'edit'>('create')

  setCreateMode():void{
    this.mode.set('create');
  }
  setEditMode():void{
    this.mode.set('edit');
  }

  openForm(): void {
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  toggleForm(): void {
    this.isFormOpen.update(value => !value);
  }
}