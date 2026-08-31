import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { GenericInputComponent } from './generic-input.component';

describe('GenericInputComponent', () => {
  let component: GenericInputComponent;
  let fixture: ComponentFixture<GenericInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericInputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Nome');
    const field = TestBed.runInInjectionContext(() => form(signal('')));
    fixture.componentRef.setInput('field', field);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
