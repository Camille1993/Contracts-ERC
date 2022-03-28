import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BigNumber, BigNumberish } from 'ethers';
import { Erc721 } from '../services/erc721'; 

@Component({
  selector: 'app-contract-erc721',
  templateUrl: './contract-erc721.component.html',
  styleUrls: ['./contract-erc721.component.scss']
})
export class ContractErc721Component {
  owner?: string;
  tokens?: BigNumberish;
  tokensId?: BigNumberish[] = [];
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
    const balanceOf = await this.ERC721.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    this.tokens = balanceOf.toString();
  }
  async mintToken() {
    const mintToken = await this.ERC721.safeMint('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    await mintToken.wait();
    alert('your token had been minted') 
  }
  async sendToken() {
    const values = this.sendForm.value;
    const sendToken = await this.ERC721.transferFrom(values.sender, values.recipient, values.tokenId);
    await sendToken.wait();
    alert("token had been send !")
  }

  async getTokens() {
    const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

    const filterReceived = this.ERC721.filters.Transfer(null, address);
    const filterSend = this.ERC721.filters.Transfer(address);

    const [received, send] = await Promise.all([
      this.ERC721.queryFilter(filterReceived),
      this.ERC721.queryFilter(filterSend),
    ]);

    const tokensReceived = received.map((token) => {
      return this.tokensId!.push(token.args.tokenId.toString())    
    });

     const tokensSent = send.map((tokens) => {
      const sendTokenIndex = this.tokensId!.findIndex((token) => token == tokens.args.tokenId.toString());
      return this.tokensId!.splice(sendTokenIndex, 1)
    });
  }
}
