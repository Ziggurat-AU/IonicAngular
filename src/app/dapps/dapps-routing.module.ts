import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dappsPage } from './dapps.page';

const routes: Routes = [
  {
    path: '',
    component: dappsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class dappsPageRoutingModule {}
