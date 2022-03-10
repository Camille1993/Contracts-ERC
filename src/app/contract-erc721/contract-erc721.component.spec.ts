import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractErc721Component } from './contract-erc721.component';

describe('ContractErc721Component', () => {
  let component: ContractErc721Component;
  let fixture: ComponentFixture<ContractErc721Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractErc721Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractErc721Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
