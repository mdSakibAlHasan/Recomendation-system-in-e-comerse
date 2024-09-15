import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RouteConstant } from '../core/constants/route-constant';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: RouteConstant.Home, component: HomeComponent},
  {path: RouteConstant.Cart, component: CartComponent},
  {
    path: RouteConstant.Product, 
    loadChildren: ()=> import('./product/product.module').then(m => m.ProductModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
