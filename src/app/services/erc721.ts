import { Injectable } from "@angular/core";
import { MetaMask } from "@ngeth/ethers";
import { addresses, MyErc721 } from "../contracts";

@Injectable({providedIn: 'root'})
export class Erc721 extends MyErc721 {
  constructor(private metamask: MetaMask) {
    super(addresses.MyErc721, metamask.getSigner());
  }
}