import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineJoinComponent } from './online-join.component';

describe('OnlineJoinComponent', () => {
  let component: OnlineJoinComponent;
  let fixture: ComponentFixture<OnlineJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineJoinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnlineJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
