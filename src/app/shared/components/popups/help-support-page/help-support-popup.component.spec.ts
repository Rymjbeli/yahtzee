import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSupportPopupComponent } from './help-support-popup.component';

describe('HelpSupportPageComponent', () => {
  let component: HelpSupportPopupComponent;
  let fixture: ComponentFixture<HelpSupportPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSupportPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSupportPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
