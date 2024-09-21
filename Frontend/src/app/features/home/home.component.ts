import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Product } from './home.model';
import { AlertService } from '../../shared/alert/alert.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { RouterModule } from '@angular/router';
import { AddProductService } from '../add-product/add-product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  products: Product[] = [];
  first: number = 0;
  rows: number = 10;
  searchText: string = ''
  totalRecord: number = 0 ;
  baseImgUrl = 'http://localhost:8000/'
  minPrice: number = 0;
  maxPrice: number = Infinity;
  sortOrder: string = 'asc';
  superUser: boolean = false;
  constructor(
    private homeService: HomeService,
    private alertService: AlertService,
    private router: Router,
    private addProductService: AddProductService
  ){}

  ngOnInit(): void {
    this.homeService.currentProduct.subscribe(updatedProducts => {
      this.products = updatedProducts;
    });
    this.homeService.getAllProduct().subscribe({
      next: res=>{
        this.homeService.updateProduct(res);
      },
      error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    })
    this.addProductService.getUserDetails().subscribe(res=>{
      res[0].userType === 'S' ? this.superUser = true: null;
    })
  }


  goToProduct(id: number) {
    // debugger
    this.superUser ? this.router.navigate(['/updateProduct', id]) : this.router.navigate(['/products', id]);
  }

  onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 0;
  }

  applyFilters(): void {
    // Filter by price range
    this.products = this.products.filter(product => {
      return product.price >= this.minPrice && product.price <= this.maxPrice;
    });

    // Sort by price based on selected sortOrder
    this.products.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.price - b.price; // Ascending order
      } else {
        return b.price - a.price; // Descending order
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }  

}
