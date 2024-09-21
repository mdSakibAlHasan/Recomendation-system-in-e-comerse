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
  searchText: string = "";
  assetsPath: string = "assets/img";
  categories: any[] = [];
  cartItemsCount: number = 0;
  userDetails: any;
  isLogin: boolean = false;

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

    this.navbarService.getCartNumber().subscribe({
      next: res =>{
        this.cartItemsCount = res.cart_count;
      },
      error: err=>{

      }
    })
    this.navbarService.getCategory().subscribe({
      next: res=>{
        this.categories = res;
      },
      error: err=>{
        console.log('Categories are not able to fetch')
      }
    })
  }

  onCategoryChange(event:any){
    this.navbarService.updateProductInfo(event.value.id).subscribe({
      next: res=>{
        this.homeService.updateProduct(res);
      },
      error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    })
  }

  search(){
    if (this.searchText.trim() !== '') {
      const modifiedSearchText = this.searchText.trim().replace(/\s+/g, '+');
      this.navbarService.updateProductBySearch(modifiedSearchText).subscribe({
        next: filteredProducts=>{
          this.homeService.updateProduct(filteredProducts);
        },error: err=>{
          this.alertService.tosterDanger('Something went wrong for search');
        }
      })
      
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isLogin = false;
    this.userDetails = {}; 
    this.router.navigate(['home'])
  }
}
