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
  balanceOfBatch(accounts: string[], tokenId: BigNumberish[]): Promise<BigNumber[]> {
    return this.functions['balanceOfBatch'](accounts, tokenId);
  }
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
  mint(
    account: string, 
    id: BigNumberish, 
    amount: BigNumberish, 
    data: string, 
    overrides: Overrides = {}
    ): Promise<ContractTransaction> {
    return this.functions['mint'](account, id, amount, data, overrides);
  }
  mintBatch(
    recipient: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: string,
    overrides: Overrides = {},
  ): Promise<ContractTransaction> {
    return this.functions['mintBatch'](recipient, ids, amounts, data, overrides);
  }
  renonceOwnership(overrides: Overrides = {}): Promise<ContractTransaction> {
    return this.functions['renonceOwnership'](overrides);
  }
  safeBatchTransferFrom(
    sender: string,
    recipient: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: string,
    overrides: Overrides = {}
  ): Promise<ContractTransaction> {
    return this.functions['safeBatchTransferFrom'](sender, recipient, ids, amounts, data, overrides);
  }
  safeTransferFrom(
    sender: string,
    recipient: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    data: string,
    overrides: Overrides = {}
    ): Promise<ContractTransaction> {
    return this.functions['safeTransferFrom'](sender, recipient, tokenId, amount, data, overrides);
  }
  setApprovalForAll(operator: string, approved: boolean, overrides: Overrides = {}): Promise<ContractTransaction> {
    return this.functions['setApprovalForAll'](operator, approved, overrides);
  }
  setURI(newUri: string, overrides: Overrides = {}): Promise<ContractTransaction> {
    return this.functions['setURI'](newUri, overrides);
  }
  transferOwnership(newOwner: string, overrides: Overrides = {}): Promise<ContractTransaction> {
    return this.functions['transferOwnership'](newOwner, overrides);
  }
}