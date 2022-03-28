import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Erc20 } from '../services/erc20';

@Component({
  selector: 'app-contract-erc20',
  templateUrl: './contract-erc20.component.html',
  styleUrls: ['./contract-erc20.component.scss']
})
export class ContractErc20Component {
  owner?: string;
  tokens?: string;
  sendForm = new FormGroup({
    recipient: new FormControl(''),
    nbTokens: new FormControl(''),
  });

  constructor(private ERC20: Erc20) { }

  async getOwner() {
    this.owner = await this.ERC20.owner();
  }

  async getBalance() {
    const balanceOf = await this.ERC20.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    this.tokens = balanceOf.toString();
  }

  async mintTokens() {
    const mintTokens = await this.ERC20.mint('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 1500);
    console.log(mintTokens);    
  }
  async sendTokens() {
    const values = this.sendForm.value;    
    const sendToken = await this.ERC20.transfer(values.recipient, values.nbTokens);
    console.log(sendToken);
  }

}
