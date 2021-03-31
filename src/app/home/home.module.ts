import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { homePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { homePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    homePageRoutingModule,
  ],
  declarations: [homePage],
})
export class homePageModule {}
