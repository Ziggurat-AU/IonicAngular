import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { walletPage } from './wallet.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { walletPageRoutingModule } from './wallet-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    walletPageRoutingModule,
  ],
  declarations: [walletPage],
})
export class walletPageModule {}
