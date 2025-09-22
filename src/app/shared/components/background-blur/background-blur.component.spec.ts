import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundBlurComponent } from './background-blur.component';

describe('BackgroundBlurComponent', () => {
  let component: BackgroundBlurComponent;
  let fixture: ComponentFixture<BackgroundBlurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundBlurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundBlurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
