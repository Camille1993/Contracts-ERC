import { Injectable } from "@angular/core";
import { BigNumber, BigNumberish, Contract, ethers, Overrides, ContractTransaction} from "ethers";
import { abi } from "./erc721abi";

@Injectable({providedIn: 'root'})
export class Erc721 extends Contract {
  constructor() {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const contractAddress: string = '0xf9b7976559e5A3E7B1ABA65d1457eE9AB113225c';
    super(contractAddress, abi, signer);
  }
  // read functions
  balanceOf(ownerAddress: string): Promise<BigNumber>{
    return this.functions['balanceOf'](ownerAddress);    
  }
  getApproved(tokenId: BigNumberish): Promise<string> {
    return this.functions['getApproved'](tokenId);
  }
  isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return this.functions['isApprovedForAll'](owner, operator)
  }
  name(): Promise<string> {
    return this.functions['name']();
  }
  owner() : Promise<string> {
    return this.functions['owner']();
  }
  supportsInterfaces(interfaceId: string): Promise<boolean> {
    return this.functions['supportsInterface'](interfaceId);
  }
  symbol() : Promise<string> {
    return this.functions['symbol']();
  }
  tokenUri(tokenId: BigNumberish): Promise<string> {
    return this.functions['tokenURI'](tokenId);
  }

  // write function
  approve(address: string, tokenId: BigNumberish): Promise<ContractTransaction> {    
    return this.functions['approve'](address, tokenId)
  }
  frontMint(address: string, overrides?: Overrides): Promise<ContractTransaction> {
    return this.functions['frontMint'](address, {overrides});
  }
  renounceOwnerShip(): Promise<ContractTransaction> {
    return this.functions['renounceOwnerShip']();
  }
  safeMint(address: string): Promise<ContractTransaction> {
    return this.functions['safeMint'](address);
  }
  safeTransferFrom(sender: string, recipient: string, tokenId: BigNumberish): Promise<ContractTransaction> {
    return this.functions['safeTransferFrom'](sender, recipient, tokenId)
  }
  safeDataTransferFrom(sender: string, recipient: string, tokenId: BigNumberish, _data:string): Promise<ContractTransaction> {
    return this.functions['safeTransferFrom'](sender, recipient, tokenId, _data)
  }
  setApprovallForAll(operator: string, approved: boolean): Promise<ContractTransaction> {
    return this.functions['setApprovalForAll'](operator, approved);
  }
  transfer(senderAddress: string, recipientAddress: string, tokenId: number): Promise<ContractTransaction> {
    return this.functions['transferFrom'](senderAddress, recipientAddress, tokenId);
  }
  transferOwnership(newOwner: string): Promise<ContractTransaction> {
    return this.functions['transferOwnership'](newOwner);
  }
}