import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { AuthUser } from '../../auth/auth.model';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const currentUser = signal<AuthUser>({
    userId: 1,
    fullName: 'Mario Rossi',
    email: 'mario.rossi@test.it',
    avatarBase64: '',
    senderAddress: {
      street: 'Via Roma, 19',
      city: 'Milano',
      postCode: '20100',
      country: 'Italia'
    },
    defaultPaymentTerms: 30
  });

  const authServiceMock = {
    currentUser: currentUser.asReadonly(),
    logout: jasmine.createSpy('logout')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close the mobile navigation menu', () => {
    const menuToggle: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.sidebar__menu-toggle'
    );

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');

    menuToggle.click();
    fixture.detectChanges();

    expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.sidebar__menu-backdrop')).toBeTruthy();

    const backdrop: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.sidebar__menu-backdrop'
    );

    backdrop.click();
    fixture.detectChanges();

    expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('.sidebar__menu-backdrop')).toBeNull();
  });
});
