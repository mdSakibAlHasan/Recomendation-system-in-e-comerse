import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import {  Router, RouterModule } from '@angular/router';
import { NavbarService } from './navbar.service';
import { AlertService } from '../../alert/alert.service';
import { HomeService } from '../../../features/home/home.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ButtonModule, InputTextModule, ToolbarModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  searchText: string = '';
  assetsPath: string = "assets/img";
  categories: any[] = [];
  cartItemsCount: number = 0;
  unreadNotificationCount: number = 0;
  userDetails: any;
  isLogin: boolean = false;
  category: number = 0;

  constructor(
    private navbarService: NavbarService,
    private router: Router,
    private alertService: AlertService,
    private homeService: HomeService
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
    this.navbarService.cartData$.subscribe(()=>{
      this.updateCartNumber();
    })
    this.navbarService.unreadNotificationData$.subscribe(()=>{
      this.updateCartNumber();
    })

    // this.updateCartNumber();
    this.navbarService.getCategory().subscribe({
      next: res=>{
        this.categories = res;
      },
      error: err=>{
        console.log('Categories are not able to fetch')
      }
    })
  }

  updateCartNumber(){
    this.navbarService.getCartNumber().subscribe({
      next: res =>{
        this.cartItemsCount = res?.cart_count;
      },
      error: err=>{
        // this.alertService.tosterDanger('Something went wrong in cart');
      }
    })
  }

  updateUnreadNotificationNumber(){
    this.navbarService.getUnreadNotificationCount().subscribe({
      next: res=>{
        this.unreadNotificationCount = res?.total_notification;
      },
      error: err=>{}
    })
  }

  onCategoryChange(event:any){
    this.homeService.updateProduct(this.searchText,event.value.id);
    this.category = event.value.id;
  }

  search(){
    if (this.searchText.trim() !== '') {
      const modifiedSearchText = this.searchText.trim().replace(/\s+/g, '+'); 
      this.homeService.updateProduct(modifiedSearchText,this.category);
      this.searchText = modifiedSearchText;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isLogin = false;
    this.userDetails = {}; 
    this.router.navigate(['home'])
  }

  clickOnCart(){
    if(this.isLogin){
      this.router.navigate(['cart'])
    }else{
      this.alertService.tosterInfo('Please login to view cart');
      this.router.navigate(['account/login']);
    }
    
  }
}
