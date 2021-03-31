import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { dappsPage } from './dapps.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { dappsPageRoutingModule } from './dapps-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: dappsPage }]),
    dappsPageRoutingModule,
  ],
  declarations: [dappsPage],
})
export class dappsPageModule {}
