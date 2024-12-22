import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeLoaderComponent } from './large-loader.component';

describe('LargeLoaderComponent', () => {
  let component: LargeLoaderComponent;
  let fixture: ComponentFixture<LargeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LargeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
