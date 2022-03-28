import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BigNumber, BigNumberish } from 'ethers';
import { Erc1155 } from '../services/erc1155';

@Component({
  selector: 'app-contract-erc1155',
  templateUrl: './contract-erc1155.component.html',
  styleUrls: ['./contract-erc1155.component.scss']
})
export class ContractErc1155Component {
  owner?: string;
  token?: BigNumberish;
  id?: number;
  tokens? : any;

  sendForm = new FormGroup({
    sender: new FormControl('', [Validators.required]),
    recipient: new FormControl('', [Validators.required]),
    tokenId: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
  });

  sendBatchForm = new FormGroup({
    sender: new FormControl('', [Validators.required]),
    recipient: new FormControl('', [Validators.required]),
    sendBatchTokenId: new FormArray([]),
    sendBatchAmountToken: new FormArray([])
  })

  mintForm = new FormGroup({
    tokenId: new FormControl('', [Validators.required]),
    nbToken: new FormControl('', [Validators.required])
  });

  mintBatchForm = new FormGroup({
    mintBatchId: new FormArray([]),
    mintBatchAmount: new FormArray([])
  });
  
  balanceOfForm = new FormGroup({
    tokenId: new FormControl('', [Validators.required]),
  });

  constructor(private ERC1155: Erc1155) {}

  async getOwner() {
    this.owner = await this.ERC1155.owner();
  }
  async getBalance() {
    const value = this.balanceOfForm.value;
    this.id = value.tokenId;
    const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const balanceOf = await this.ERC1155.balanceOf(address, value.tokenId);
    this.token = balanceOf.toString();
  }
  async mintToken() {
    const values = this.mintForm.value;
    const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';    
    const mintToken = await this.ERC1155.mint(address, values.tokenId, values.nbToken, '0x00');
    console.log(mintToken);    
  }

  get tokenIds() {
    return this.mintBatchForm.controls['mintBatchId'] as FormArray;
  }

  //create a method to compare tokenIds to have id created only one time
  async checkId() {
    const idValue = this.mintBatchForm.value.mintBatchId;
    console.log(idValue);
    
    const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; 
    const filterReceived = this.ERC1155.filters['TransferSingle'](null, null, address);
    const filterBatchReceived = this.ERC1155.filters['TransferBatch'](null, null, address);

    const [received, batchReceived] = await Promise.all([
      this.ERC1155.queryFilter(filterReceived),
      this.ERC1155.queryFilter(filterBatchReceived),
    ]);
    const token: Record<string, number> = {};

    for(const event of received) { 
      const { id: tokenId, value: amount } = event.args!;     
      const id = (tokenId as BigNumber).toString();
      if (!token[id]) token[id] = 0;
      token[id] += (amount as BigNumber).toNumber();
    }

    for (const event of batchReceived) {
      const [operator, from, to, tokenIds, amounts] = event.args!;
      for (let i =0; i< tokenIds.length; i++) {
        const id = (tokenIds[i] as BigNumber).toString();
        if(!token[id]) token[id] = 0;
        token[id] += (amounts[i] as BigNumber).toNumber()
      }
    }
    console.log(token);
    
   
  }

  get amountTokens() {
    return this.mintBatchForm.controls['mintBatchAmount'] as FormArray;
  }

  addMintToken() {
    const idForm = new FormGroup({
      idToken: new FormControl('', [Validators.required])
    });
    const amountForm = new FormGroup({
      amountToken: new FormControl('', [Validators.required])
    });
    this.tokenIds.push(idForm);
    this.amountTokens.push(amountForm);
  }
  removeMintToken(index: number) {
    this.tokenIds.removeAt(index);
    this.amountTokens.removeAt(index)
  }

  async mintBatchToken() {
    const values = this.mintBatchForm.value;
    const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    //get the array of tokens Ids
    const arrayId: number[] = values.mintBatchId.map((token: any) => {
      const iterator = Object.values(token).values();
      for (const value of iterator) {
        return value
      }
    });
    //get the array of token amounts per id
    const amountArray: number[] = values.mintBatchAmount.map((token: any) => {
      const iterator = Object.values(token).values();
      for (const value of iterator) {
        return value
      }
    });   
   
    const mintBatch = await this.ERC1155.mintBatch(address, arrayId, amountArray, '0x00');
    this.tokenIds.clear();
    this.amountTokens.clear();
    await mintBatch.wait();
    alert('All tokens are minted !')
  }

  async sendToken() {
    const values = this.sendForm.value;
    const sendToken = await this.ERC1155.safeTransferFrom(values.sender, values.recipient, values.tokenId, values.amount, '0x00');
    await sendToken.wait();
    alert('Token had been send !')
    console.log(sendToken);
  }

  get tokenIdsToSend() {
    return this.sendBatchForm.controls['sendBatchTokenId'] as FormArray;
  }
  get tokenAmountToSend() {
    return this.sendBatchForm.controls['sendBatchAmountToken'] as FormArray;
  }
  addTokensToSend() {
    const idSendForm = new FormGroup({
      idTokenToSend: new FormControl('', [Validators.required])
    });
    const amountSendForm = new FormGroup({
      amountToSend: new FormControl('', Validators.required)
    })
    this.tokenIdsToSend.push(idSendForm);
    this.tokenAmountToSend.push(amountSendForm);
  }
  removeTokenToSend(index: number) {
    this.tokenIdsToSend.removeAt(index);
    this.tokenAmountToSend.removeAt(index);
  }
  async safeBatchTransferFrom() {
    const value = this.sendBatchForm.value;
    const arrayIdSend: number[] = value.sendBatchTokenId.map((token: any) => {
      const iterator = Object.values(token).values();
      for (const value of iterator) {
        return value
      }
    });
    const amountArraySend: number[] = value.sendBatchAmountToken.map((token: any) => {
      const iterator = Object.values(token).values();
      for (const value of iterator) {
        return value
      }
    });

    const sendBatch = await this.ERC1155.safeBatchTransferFrom(value.sender, value.recipient, arrayIdSend, amountArraySend, '0x00');
    this.tokenAmountToSend.clear();
    this.tokenIdsToSend.clear();
    await sendBatch.wait();
    alert('Tokens had been send !');
    console.log(sendBatch);
    
  }

  async getTokens() {
    const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

    // Single transfer (received & sent)
    const filterReceived = this.ERC1155.filters['TransferSingle'](null, null, address);
    const filterSent = this.ERC1155.filters['TransferSingle'](null, address);

    // Batch transfer (received & sent)
    const filterBatchReceived = this.ERC1155.filters['TransferBatch'](null, null, address);
    const filterBatchSend = this.ERC1155.filters['TransferBatch'](null, address);

    const [received, batchReceived, sent, batchSent ] = await Promise.all([
      this.ERC1155.queryFilter(filterReceived),
      this.ERC1155.queryFilter(filterBatchReceived),
      this.ERC1155.queryFilter(filterSent),
      this.ERC1155.queryFilter(filterBatchSend),
    ]);

    const tokens: Record<string, number> = {};

    for(const event of received) { 
      const { id: tokenId, value: amount } = event.args!;     
      const id = (tokenId as BigNumber).toString();
      if (!tokens[id]) tokens[id] = 0;
      tokens[id] += (amount as BigNumber).toNumber();
    }

    for (const event of batchReceived) {
      const [operator, from, to, tokenIds, amounts] = event.args!;
      for (let i =0; i< tokenIds.length; i++) {
        const id = (tokenIds[i] as BigNumber).toString();
        if(!tokens[id]) tokens[id] = 0;
        tokens[id] += (amounts[i] as BigNumber).toNumber()
      }
    }

    for(const event of sent) {
      const { id: tokenId, value: amount } = event.args!;
      const id = (tokenId as BigNumber).toString();
      tokens[id] -= (amount as BigNumber).toNumber();
      if (tokens[id] <= 0) delete tokens[id];
    }

    for(const event of batchSent) {
      const [operator, from, to, tokensId, amounts] = event.args!;
      for (let i=0; i< tokensId.length; i++) {
        const id = (tokensId[i] as BigNumber).toString();
        tokens[id] -= (amounts[i] as BigNumber).toNumber();
        if (tokens[id] <= 0) delete tokens[id];
      }
    }
    //Allow to have the reccord in an Array for display
    this.tokens = Object.entries(tokens).filter(([key, value]) => [{tokenId: key, amount: value }]); 
       
  }
}
