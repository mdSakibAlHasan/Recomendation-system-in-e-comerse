import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import {  RouterModule } from '@angular/router';
import { NavbarService } from './navbar.service';

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

  constructor(
    private navbarService: NavbarService
  ) {}

  ngOnInit(): void {
    this.navbarService.getCartNumber().subscribe({
      next: res =>{
        this.cartItemsCount = res.cart_count;
      },
      error: err =>{
        console.log("User are not login")
      }
    })
  }

  search(){

  }
}
