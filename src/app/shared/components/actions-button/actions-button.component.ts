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
  editIsVisible = input<boolean>(false);
  deleteIsVisible = input<boolean>(false);

  //ordine buttons
  discardOrder = input<number>(0);
  saveAsDraftOrder = input<number>(0);
  saveAndSendOrder = input<number>(0);
  saveChangesOrder = input<number>(0);
  editOrder = input<number>(0);
  deleteOrder = input<number>(0);


  setJustifyContent = input<string>('')

  discardClicked = output<void>();
  saveAndSendClicked = output<void>();
  editClicked = output<void>();
  deleteClicked = output<void>();
  saveAsDraftClicked = output<void>()
}