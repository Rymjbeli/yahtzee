import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineCreateComponent } from './online-create.component';

describe('OnlineCreateComponent', () => {
  let component: OnlineCreateComponent;
  let fixture: ComponentFixture<OnlineCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnlineCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
