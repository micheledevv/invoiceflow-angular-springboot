import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsButtonModalComponent } from './actions-button-modal.component';

describe('ActionsButtonModalComponent', () => {
  let component: ActionsButtonModalComponent;
  let fixture: ComponentFixture<ActionsButtonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsButtonModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsButtonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
