import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-actions-button-modal',
  imports: [],
  templateUrl: './actions-button-modal.component.html',
  styleUrl: './actions-button-modal.component.scss',
})
export class ActionsButtonModalComponent {
  discardIsVisible = input<boolean>(false)
  deleteIsVisible = input<boolean>(false)
  discardClicked = output<void>();
  deleteClicked = output<void>();


}
