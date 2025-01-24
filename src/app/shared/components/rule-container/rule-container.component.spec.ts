import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleContainerComponent } from './rule-container.component';

describe('RuleContainerComponent', () => {
  let component: RuleContainerComponent;
  let fixture: ComponentFixture<RuleContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RuleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
