import { Component, inject } from '@angular/core';
import { ActionsButtonModalComponent } from '../actions-button-modal/actions-button-modal.component';
import { GenericModalService } from './generic-modal.service';

@Component({
  selector: 'app-generic-modal',
  imports: [ActionsButtonModalComponent],
  templateUrl: './generic-modal.component.html',
  styleUrl: './generic-modal.component.scss',
})
export class GenericModalComponent {
  protected readonly modalService = inject(GenericModalService);
}