import { Injectable } from "@angular/core";
import { BigNumber, BigNumberish, Contract, ethers, Overrides, ContractTransaction } from "ethers";
import { abi } from "./erc1155abi";

@Injectable({providedIn: 'root'})
export class Erc1155 extends Contract {
  constructor() {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const contractAddress: string = '0xf48eaCB09e65C9f2ac1D5B8881713BAFec2B7a84';
    super(contractAddress, abi, signer);
  }
  //read functions (read-only)
  balanceOf(account: string, tokenId: BigNumberish): Promise<BigNumber> {
    return this.functions['balanceOf'](account, tokenId);
  }
  //todo balanceOfBatch
  
  isApprovedForAll(account: string, operator: string): Promise<boolean> {
    return this.functions['isApprovedForAll'](account, operator);
  }
  owner(): Promise<string> {
    return this.functions['owner']();
  }
  supportsInterface(interfaceId: string): Promise<boolean> {
    return this.functions['supportsInterface'](interfaceId);
  }
  uri(input: BigNumberish): Promise<string> {
    return this.functions['uri'](input);
  }
  //write functions (transactions)
}