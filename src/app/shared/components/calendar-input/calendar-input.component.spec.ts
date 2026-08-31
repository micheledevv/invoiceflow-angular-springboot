import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';

import { CalendarInputComponent } from './calendar-input.component';

describe('CalendarInputComponent', () => {
  let component: CalendarInputComponent;
  let fixture: ComponentFixture<CalendarInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarInputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Data');
    fixture.componentRef.setInput('isRequired', true);
    const field = TestBed.runInInjectionContext(() => form(signal('')));
    fixture.componentRef.setInput('field', field);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
