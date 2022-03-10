import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractErc20Component } from './contract-erc20.component';

describe('ContractErc20Component', () => {
  let component: ContractErc20Component;
  let fixture: ComponentFixture<ContractErc20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractErc20Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractErc20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
