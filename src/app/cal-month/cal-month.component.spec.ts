import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalMonthComponent } from './cal-month.component';

describe('CalMonthComponent', () => {
  let component: CalMonthComponent;
  let fixture: ComponentFixture<CalMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalMonthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
