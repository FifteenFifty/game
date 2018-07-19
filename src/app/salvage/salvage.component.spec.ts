import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalvageComponent } from './salvage.component';

describe('SalvageComponent', () => {
  let component: SalvageComponent;
  let fixture: ComponentFixture<SalvageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalvageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalvageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
