import { Routes } from '@angular/router';
import { RouteConstant } from './core/constants/route-constant';

export const routes: Routes = [
   {
      path: RouteConstant.Account,
      loadChildren: ()=> import('./outside-layout/account/account.module').then(m => m.AccountModule),
   },
   {
      path: '',
      loadChildren: ()=> import('./features/features.module').then(m => m.FeaturesModule),
   }
];
