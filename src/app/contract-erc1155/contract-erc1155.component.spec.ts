import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractErc1155Component } from './contract-erc1155.component';

describe('ContractErc1155Component', () => {
  let component: ContractErc1155Component;
  let fixture: ComponentFixture<ContractErc1155Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractErc1155Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractErc1155Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
