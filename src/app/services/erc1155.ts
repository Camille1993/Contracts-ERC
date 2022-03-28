import { Injectable } from "@angular/core";
import { MetaMask } from "@ngeth/ethers";
import { addresses, MyErc1155 } from "../contracts";

@Injectable({providedIn: 'root'})
export class Erc1155 extends MyErc1155 {
  constructor(private metamask: MetaMask) {
    super(addresses.MyErc1155, metamask.getSigner());
  }
}