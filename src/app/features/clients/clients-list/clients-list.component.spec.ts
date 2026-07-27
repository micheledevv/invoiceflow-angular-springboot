import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsListComponent } from './clients-list.component';
import it from '@angular/common/locales/it';

describe('ClientsComponent', () => {
  let component: ClientsListComponent;
  let fixture: ComponentFixture<ClientsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
