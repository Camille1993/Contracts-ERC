import { Injectable } from "@angular/core";
import { Contract, ethers } from "ethers";
import { abi } from "./erc20abi";

@Injectable({providedIn: 'root'})
export class Erc20 extends Contract {
  constructor() {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const address: string = '0xd57cDE5e9a886f49BB6B1C44B0F2c692D177a5B7';
    super(address, abi, signer);
  }

  owner() {
    return this.functions['owner']();
  }

  balanceOf(address: string) {
    return this.functions['balanceOf'](address);
  }

  async mint(address: string, nbToken: number) {
    const txMint = await this.functions['mint'](address, nbToken);
    await txMint.wait();
  }

  async transfer(address: string, nbToken: number) {
    const txSend = await this.functions['transfer'](address, nbToken)
    await txSend.wait();
  }
}