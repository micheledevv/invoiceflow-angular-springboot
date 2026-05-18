import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  private readonly router = inject(Router);

  goHome(): void {
    this.router.navigate(['']);
  }

  goBack(): void {
    window.history.back();
  }
}