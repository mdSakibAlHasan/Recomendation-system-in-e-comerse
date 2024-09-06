import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RouteConstant } from '../core/constants/route-constant';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: RouteConstant.Home, component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
