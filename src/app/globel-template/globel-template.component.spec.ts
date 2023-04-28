import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobelTemplateComponent } from './globel-template.component';

describe('GlobelTemplateComponent', () => {
  let component: GlobelTemplateComponent;
  let fixture: ComponentFixture<GlobelTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobelTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
