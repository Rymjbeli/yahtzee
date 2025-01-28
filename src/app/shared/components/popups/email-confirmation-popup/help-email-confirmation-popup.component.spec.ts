import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEmailConfirmationPopupComponent } from './help-email-confirmation-popup.component';

describe('EmailConfirmationPopupComponent', () => {
  let component: HelpEmailConfirmationPopupComponent;
  let fixture: ComponentFixture<HelpEmailConfirmationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpEmailConfirmationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpEmailConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
