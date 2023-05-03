import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountlayerComponent } from './accountlayer.component';

describe('AccountlayerComponent', () => {
  let component: AccountlayerComponent;
  let fixture: ComponentFixture<AccountlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
