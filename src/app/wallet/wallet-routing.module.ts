import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { walletPage } from './wallet.page';

const routes: Routes = [
  {
    path: '',
    component: walletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class walletPageRoutingModule {}
