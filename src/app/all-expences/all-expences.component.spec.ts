import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllExpencesComponent } from './all-expences.component';

describe('AllExpencesComponent', () => {
  let component: AllExpencesComponent;
  let fixture: ComponentFixture<AllExpencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllExpencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllExpencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
