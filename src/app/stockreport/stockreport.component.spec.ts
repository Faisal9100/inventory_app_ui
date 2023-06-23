import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockreportComponent } from './stockreport.component';

describe('StockreportComponent', () => {
  let component: StockreportComponent;
  let fixture: ComponentFixture<StockreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
