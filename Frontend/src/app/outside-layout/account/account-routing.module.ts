import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstant } from '../../core/constants/route-constant';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {path:'',redirectTo:RouteConstant.Login,pathMatch:"full"},
  {path:RouteConstant.Login,component: LoginComponent},
  {path:RouteConstant.ForgotPassword,component: ForgotPasswordComponent},
  {path:RouteConstant.Registration,component: RegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
