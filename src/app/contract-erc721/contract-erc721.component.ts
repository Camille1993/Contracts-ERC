import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BigNumberish } from 'ethers';
import { Erc721 } from './erc721';

@Component({
  selector: 'app-contract-erc721',
  templateUrl: './contract-erc721.component.html',
  styleUrls: ['./contract-erc721.component.scss']
})
export class ContractErc721Component {
  owner?: string;
  tokens?: BigNumberish;
  tokensId?: BigNumberish[];
  sendForm = new FormGroup({
    sender: new FormControl(''),
    recipient: new FormControl(''),
    tokenId: new FormControl(''),
  });

  constructor(private ERC721: Erc721) { }

  async getOwner() {
    this.owner = await this.ERC721.owner();
  }
  async getBalance() {
    const balanceOf = await this.ERC721.balanceOf('0x228CD317eDD31b7417Ed3DC1334f43b35199Be4e');
    this.tokens = balanceOf.toString();
  }
  async mintToken() {
    const mintToken = await this.ERC721.frontMint('0x228CD317eDD31b7417Ed3DC1334f43b35199Be4e');
    console.log(mintToken);    
  }
  async sendToken() {
    const values = this.sendForm.value;
    const sendToken = await this.ERC721.transfer(values.sender, values.recipient, values.tokenId);
    console.log(sendToken);
  }

  async getAllBalance() {
    const address = '0x228CD317eDD31b7417Ed3DC1334f43b35199Be4e';
    //query tokens mint
    const eventFilterTo = this.ERC721.filters['Transfer'](null, address);
    const queryFilterTo = await this.ERC721.queryFilter(eventFilterTo);
    const tokensTo = queryFilterTo.map((token) => {
      const tokenId = Object.values(token.args!);
      return tokenId[5].toString()    
    });

    //query tokens send
    const eventFilterFrom = this.ERC721.filters['Transfer'](address);
    const queryFilterFrom = await this.ERC721.queryFilter(eventFilterFrom);
     const tokensFrom = queryFilterFrom.map((token) => {
      const tokenId = Object.values(token.args!);
      return tokenId[5].toString()    
    });

    // remove send tokens to total of possessed tokens
    this.tokensId = tokensTo.filter((token) => token != tokensFrom);
  }

}
