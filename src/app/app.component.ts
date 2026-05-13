import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { InvoiceFormService } from './components/invoice-form/invoice-form.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, InvoiceFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  invoiceFormService = inject(InvoiceFormService);

  isFormOpen = this.invoiceFormService.isFormOpen;
}