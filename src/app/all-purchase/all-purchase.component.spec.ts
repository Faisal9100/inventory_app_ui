import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPurchaseComponent } from './all-purchase.component';

describe('AllPurchaseComponent', () => {
  let component: AllPurchaseComponent;
  let fixture: ComponentFixture<AllPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
