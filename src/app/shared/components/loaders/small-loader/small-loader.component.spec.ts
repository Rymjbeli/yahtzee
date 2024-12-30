import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallLoaderComponent } from './small-loader.component';

describe('SmallLoaderComponent', () => {
  let component: SmallLoaderComponent;
  let fixture: ComponentFixture<SmallLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmallLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
