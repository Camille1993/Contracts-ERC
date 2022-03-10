import { Component } from '@angular/core';
import { ethers } from 'ethers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  provider?: any;
  signer?: any;
  owner?: string;

  constructor() { }

  async connect() {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    this.provider = await provider.send("eth_requestAccounts", []);
    this.signer = provider.getSigner();   
  }

}
