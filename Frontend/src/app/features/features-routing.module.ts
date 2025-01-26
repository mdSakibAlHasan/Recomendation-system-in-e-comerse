import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RouteConstant } from '../core/constants/route-constant';
import { CartComponent } from './cart/cart.component';
import { SummaryComponent } from './cart/summary/summary.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProductComponent } from './add-product/add-product.component';
import { NotificationComponent } from './notification/notification.component';
import { ProductStatusComponent } from './product-status/product-status.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: RouteConstant.Home, component: HomeComponent},
  {path: RouteConstant.Cart, component: CartComponent},
  {path: RouteConstant.Summary, component: SummaryComponent},
  {path: RouteConstant.Profile, component: ProfileComponent},
  {path: RouteConstant.AddProduct, component: AddProductComponent},
  {path: RouteConstant.Notification, component: NotificationComponent},
  {path: RouteConstant.UpdateProduct+'/:id', component: AddProductComponent},
  {path: RouteConstant.ProductStatus,component:ProductStatusComponent},
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
