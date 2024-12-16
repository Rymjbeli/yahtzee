import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonRollComponent } from './button-roll.component';

describe('ButtonRollComponent', () => {
  let component: ButtonRollComponent;
  let fixture: ComponentFixture<ButtonRollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonRollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
