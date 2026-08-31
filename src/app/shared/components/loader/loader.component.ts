import { Component, inject, OnInit, signal } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent  {
  readonly loaderService = inject(LoaderService);
  constructor(){}


 
}