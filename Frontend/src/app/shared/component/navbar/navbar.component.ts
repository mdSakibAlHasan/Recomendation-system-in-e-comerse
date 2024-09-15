import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import {  Router, RouterModule } from '@angular/router';
import { NavbarService } from './navbar.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ButtonModule, InputTextModule, ToolbarModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  searchText: string = "";
  assetsPath: string = "assets/img";
  categories = [
    { label: 'Girls', value: 'girls' },
    { label: 'Boys', value: 'boys' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Laptops', value: 'laptops' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Home Appliances', value: 'home-appliances' },
  ];
  cartItemsCount: number = 0;
  userDetails: any;
  isLogin: boolean = false;

  constructor(
    private navbarService: NavbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.navbarService.getUserDetails().subscribe({
      next: res=>{
        this.userDetails = res;
        this.isLogin = true;
        this.navbarService.updateLoginInfo(true);
      },
      error: err=>{
        console.log('User is not login')
      }
    })
    this.navbarService.loginData$.subscribe((loginStatus) => {
      this.isLogin = loginStatus;
    });

    this.navbarService.getCartNumber().subscribe({
      next: res =>{
        this.cartItemsCount = res.cart_count;
      },
      error: err=>{

      }
    })
  }

  search(){

  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isLogin = false;
    this.userDetails = {}; 
    this.router.navigate(['home'])
  }
}
