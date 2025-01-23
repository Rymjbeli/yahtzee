import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPlayerNameComponent } from './input-player-name.component';

describe('InputPlayerNameComponent', () => {
  let component: InputPlayerNameComponent;
  let fixture: ComponentFixture<InputPlayerNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPlayerNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputPlayerNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
