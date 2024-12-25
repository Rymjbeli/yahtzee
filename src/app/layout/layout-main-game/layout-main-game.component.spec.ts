import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMainGameComponent } from './layout-main-game.component';

describe('LayoutMainGameComponent', () => {
  let component: LayoutMainGameComponent;
  let fixture: ComponentFixture<LayoutMainGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutMainGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutMainGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
