import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BigNumberish } from 'ethers';
import { isEmpty } from 'rxjs';
import { Erc1155 } from './erc1155';

@Component({
  selector: 'app-contract-erc1155',
  templateUrl: './contract-erc1155.component.html',
  styleUrls: ['./contract-erc1155.component.scss']
})
export class ContractErc1155Component {
  owner?: string;
  tokens?: BigNumberish;
  id?: number;
  tokensId?: BigNumberish[];

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
    const balanceOf = await this.ERC1155.balanceOf('0x228CD317eDD31b7417Ed3DC1334f43b35199Be4e', value.tokenId);
    this.tokens = balanceOf.toString();
  }
  async mintToken() {
    const values = this.mintForm.value;
    const mintToken = await this.ERC1155.mint('0x228CD317eDD31b7417Ed3DC1334f43b35199Be4e', values.tokenId, values.nbToken, '0x00');
    console.log(mintToken);    
  }

  get tokenIds() {
    return this.mintBatchForm.controls['mintBatchId'] as FormArray;
  }
  //create a method to compare tokenIds to have id created only one time
  checkId() {
    const idValue = this.mintBatchForm.value.mintBatchId;
    console.log(idValue);
    
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
   
    const mintBatch = await this.ERC1155.mintBatch('0x228CD317eDD31b7417Ed3DC1334f43b35199Be4e', arrayId, amountArray, '0x00');
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
    const arrayId: number[] = value.sendBatchTokenId.map((token: any) => {
      const iterator = Object.values(token).values();
      for (const value of iterator) {
        return value
      }
    });
    const amountArray: number[] = value.sendBatchAmountToken.map((token: any) => {
      const iterator = Object.values(token).values();
      for (const value of iterator) {
        return value
      }
    });

    const sendBatch = await this.ERC1155.safeBatchTransferFrom(value.sender, value.recipient, arrayId, amountArray, '0x00');
    this.tokenAmountToSend.clear();
    this.tokenIdsToSend.clear();
    await sendBatch.wait();
    alert('Tokens had been send !')
  }

  async getTokensIds() {
    const address = '0x228CD317eDD31b7417Ed3DC1334f43b35199Be4e';
    //query token when single mint
    const eventFilterTo = this.ERC1155.filters['TransferSingle'](null, null, address);
    const queryFilterTo = await this.ERC1155.queryFilter(eventFilterTo);
    
    const tokensIdTo = queryFilterTo.map((token) => {
      const tokensTo = Object.values(token.args!);
      const tokenIdTo = tokensTo[3].toString();
      const tokenAmountTo = tokensTo[4].toString();
      const tokenValueTo = {tokenId: parseInt(tokenIdTo), tokenAmount: parseInt(tokenAmountTo)};    
      return tokenValueTo;
    });  

    //query token when batch mint
    const eventFilterToBatch = this.ERC1155.filters['TransferBatch'](null, null, address);
    const queryFilterToBatch = await this.ERC1155.queryFilter(eventFilterToBatch)
    ;
    const tokensIdToBatch = queryFilterToBatch.map((token) => {
      const tokensToBatch = Object.values(token.args!);  
      const idTokenToBatch = tokensToBatch[3].toString();
      const amountTokenToBatch = tokensToBatch[4].toString();
      const valueTokenToBatch = {tokenId: idTokenToBatch, amountToken: amountTokenToBatch};    
      return valueTokenToBatch;
    });
    let allTokenIdTo:any = [];
    let allTokenAmountTo: any = []

    for (let i =0; i< tokensIdToBatch.length; i++) {
      const elementsId = tokensIdToBatch[i].tokenId.split(',');
      const elementsAmount = tokensIdToBatch[i].amountToken.split(',');
      allTokenIdTo.push(elementsId);
      allTokenAmountTo.push(elementsAmount);    
    }
    //allow to pass from a array of array to a single array
    const alltokensIds = allTokenIdTo.map((element: any) => {
      const elementTokenId = Array.from(element);
      return elementTokenId.filter(arg => arg != ',');
    }).toString().split(',');
    const alltokensAmounts = allTokenAmountTo.map((element: any) => {
      const elementTokenAmount = Array.from(element);
      return elementTokenAmount.filter(arg => arg != ',');
    }).toString().split(',');
    //allow to pair the mint token with his amount
    let allBatchMintTokens:any = [];
    for (let i =0; i< alltokensIds.length; i++) {
      allBatchMintTokens.push({tokenId: parseInt(alltokensIds[i]), tokenAmount: parseInt(alltokensAmounts[i])})
    }
    //group all mint tokens (id & amount)
    let allMintToken: any;
    if(queryFilterToBatch.length > 0 && queryFilterTo.length > 0 ) {
      allMintToken =  tokensIdTo.concat(allBatchMintTokens)
    } else if(queryFilterTo.length <= 0) {
      allMintToken = allBatchMintTokens;
    } else if (queryFilterToBatch.length <= 0) {
      allMintToken = tokensIdTo
    } else {
      alert('You haven\'t mint any token!');
    }
    
    console.log(allMintToken);    
      
    //query send token (single)
    const eventFilterFrom = this.ERC1155.filters['TransferSingle'](null, address, null);
    const queryFilterFrom = await this.ERC1155.queryFilter(eventFilterFrom);
      
    const tokensIdFrom = queryFilterFrom.map((token) => {
      const tokensFrom = Object.values(token.args!);
      const tokenIdFrom = tokensFrom[3].toString();
      const tokenAmountFrom = tokensFrom[4].toString();
      const tokenValueFrom = {tokenId: tokenIdFrom, tokenAmount: tokenAmountFrom};    
      return tokenValueFrom;     
    });  

    //query send token (batch)
    const eventFilterFromBatch = this.ERC1155.filters['TransferBatch'](null, address, null);
    const queryFilterFromBatch = await this.ERC1155.queryFilter(eventFilterFromBatch);

    const tokensIdFromBatch = queryFilterFromBatch.map((token) => {
      const tokensFromBatch = Object.values(token.args!);
      const idTokenFromBatch = tokensFromBatch[3].toString();
      const amountTokenFromBatch = tokensFromBatch[4].toString();
      const valueTokenFromBatch = {tokenId: idTokenFromBatch, amountToken: amountTokenFromBatch};    
      return valueTokenFromBatch;     
    });
    let allTokenIdFrom:any = [];
    let allTokenAmountFrom: any = []

    for (let i =0; i< tokensIdFromBatch.length; i++) {
      const elementsId = tokensIdFromBatch[i].tokenId.split(',');
      const elementsAmount = tokensIdFromBatch[i].amountToken.split(',');
      allTokenIdFrom.push(elementsId);
      allTokenAmountFrom.push(elementsAmount);    
    }
    //allow to pass from a array of array to a single array
    const alltokensIdsFrom = allTokenIdFrom.map((element: any) => {
      const elementTokenId = Array.from(element);
      return elementTokenId.filter(arg => arg != ',');
    }).toString().split(',');
    const alltokensAmountsFrom = allTokenAmountFrom.map((element: any) => {
      const elementTokenAmount = Array.from(element);
      return elementTokenAmount.filter(arg => arg != ',');
    }).toString().split(',');
    //allow to pair the send token with his amount
    let allBatchSendTokens:any = [];
    for (let i =0; i< alltokensIdsFrom.length; i++) {
      allBatchSendTokens.push({tokenId: parseInt(alltokensIdsFrom[i]), tokenAmount: parseInt(alltokensAmountsFrom[i])})
    }
    //group all send tokens (id & amount)
    let allSendToken: any;
    if (queryFilterFromBatch.length > 0 && queryFilterFrom.length > 0){
      allSendToken =  tokensIdFrom.concat(allBatchSendTokens)
    } else if (queryFilterFromBatch.length <= 0){
      allSendToken = tokensIdFrom;
    } else if (queryFilterFrom.length <=0) {
      allSendToken = allBatchSendTokens
    } else {
      alert('You haven\' send any token')
    }
    console.log(allSendToken);    
  }

}
