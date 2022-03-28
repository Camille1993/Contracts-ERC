import { Component, OnInit } from '@angular/core';
import { BigNumber, BigNumberish } from 'ethers';
import { ethers } from 'ethers';
import { ChainManager, MetaMask } from "@ngeth/ethers";
import { Chain } from './type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.scss']
})
export class MetamaskComponent {
  account?: string;
  chain$?: Observable<Chain>;

  provider?: any;
  signer?: any;
  owner?: string;
  connected ?: boolean;
  constructor(private metamask: MetaMask, private chainManager: ChainManager) {
  }
  ngOnInit() {
    const account = this.metamask.account;
    this.account = `${account?.slice(0, 5)}...${account?.substring(account.length - 4)}`;
    this.chain$ = this.chainManager.chain$;
  }
  async connect() {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    this.provider = await provider.send("eth_requestAccounts", []);
    this.signer = provider.getSigner();
    this.connected = true; 
  }

}
