import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EthersModule } from '@ngeth/ethers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ContractErc20Component } from './contract-erc20/contract-erc20.component';
import { ContractErc721Component } from './contract-erc721/contract-erc721.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
//import angular Material for ui
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ContractErc1155Component } from './contract-erc1155/contract-erc1155.component';
import { MetamaskComponent } from './metamask/metamask.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContractErc20Component,
    ContractErc721Component,
    ContractErc1155Component,
    MetamaskComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'contract/ERC20', component: ContractErc20Component },
      { path: 'contract/ERC721', component: ContractErc721Component },
      { path: 'contract/ERC1155', component: ContractErc1155Component }
    ]),
    EthersModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
