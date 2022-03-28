import { Injectable } from "@angular/core";
import { MetaMask } from "@ngeth/ethers";
import { addresses, MyErc20 } from "../contracts";

@Injectable({providedIn: 'root'})
export class Erc20 extends MyErc20 {
  constructor(private metamask: MetaMask) {
    super(addresses.MyErc20, metamask.getSigner());
  }
}