import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { InvoiceFormService } from './components/invoice-form/invoice-form.service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { GenericModalComponent } from "./shared/components/generic-modal/generic-modal.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, InvoiceFormComponent, LoaderComponent, GenericModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  invoiceFormService = inject(InvoiceFormService);

  isFormOpen = this.invoiceFormService.isFormOpen;
}