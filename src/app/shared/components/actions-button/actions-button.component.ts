import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-actions-button',
  imports: [],
  templateUrl: './actions-button.component.html',
  styleUrl: './actions-button.component.scss'
})
export class ActionsButtonComponent {
  discardIsVisible = input<boolean>(false);
  saveAsDraftIsVisible = input<boolean>(false);
  saveAndSendIsVisible = input<boolean>(false);
  saveChangesIsVisible = input<boolean>(false);
  editIsVisible = input<boolean>(false)
  deleteIsVisible = input<boolean>(false)
  discardClicked = output<void>();
  saveAndSendClicked = output<void>();
  editClicked = output<void>();
  deleteClicked = output<void>()

}
