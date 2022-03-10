import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Erc20 } from './erc20';

@Component({
  selector: 'app-contract-erc20',
  templateUrl: './contract-erc20.component.html',
  styleUrls: ['./contract-erc20.component.scss']
})
export class ContractErc20Component {
  owner?: string;
  tokens?: number;
  sendForm = new FormGroup({
    recipient: new FormControl(''),
    nbTokens: new FormControl(''),
  });


  constructor(private ERC20: Erc20) { }

  async getOwner() {
    this.owner = await this.ERC20.owner();
  }

  async getBalance() {
    const balanceOf = await this.ERC20.balanceOf('0x228CD317eDD31b7417Ed3DC1334f43b35199Be4e');
    this.tokens = balanceOf.toString();
  }

  async mintTokens() {
    const mintTokens = await this.ERC20.mint('0x228CD317eDD31b7417Ed3DC1334f43b35199Be4e', 15);
    console.log(mintTokens);    
  }
  async sendTokens() {
    const values = this.sendForm.value;    
    const sendToken = await this.ERC20.transfer(values.recipient, values.nbTokens);
    console.log(sendToken);
  }

}
