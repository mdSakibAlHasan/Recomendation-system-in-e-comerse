import { Component, HostListener, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { AlertService } from '../../shared/alert/alert.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { RouterModule } from '@angular/router';
import { AddProductService } from '../add-product/add-product.service';
import { ProductModel } from '../../shared/model/product.model';
import { Pagination } from '../../core/constants/general';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  products: ProductModel[] = [];
  first: number = 0;
  rows: number = 10;
  searchText: string = ''
  totalRecord: number = 0 ;
  baseImgUrl = 'http://localhost:8000/'
  minPrice: number = -Infinity;
  maxPrice: number = Infinity;
  sortOrder: string = '';
  superUser: boolean = false;
  page = 1;
  totalProductCount: number = Infinity;
  loading = false;    //for pagination
  categoryID: number = 0;
  constructor(
    private homeService: HomeService,
    private alertService: AlertService,
    private router: Router,
    private addProductService: AddProductService
  ){}

  ngOnInit(): void {
    this.homeService.currentProduct.subscribe(updatedProducts => {
      this.categoryID = updatedProducts.categoryID??0;
      this.searchText = updatedProducts.searchText??'';
      this.products = [];
      this.page = 1;
      this.updateProduct();
    });
    // this.loadProduct();
    this.addProductService.getUserDetails().subscribe(res=>{
      res[0].userType === 'S' ? this.superUser = true: null;
    })
  }

  updateProduct(){
    if((this.page==1 || (this.page*Pagination.HomePageSize)<=this.totalProductCount)){
      this.loading = true;
      this.homeService.updateProductInfo(this.categoryID, this.searchText,this.maxPrice,this.minPrice, this.page,this.sortOrder).subscribe({
        next: res=>{
          this.products = [...this.products, ...res.results];
          this.page++;
          this.totalProductCount = res.count;
          this.loading = false;
        }, error: err=>{
          this.loading = false;
          // this.alertService.tosterDanger('Something went wrong to filter product');
        } 
      })
    }
  }

  // loadProduct(){
  //   if((this.page*Pagination.HomePageSize)<=this.totalProductCount){
  //     this.loading = true;
  //     this.homeService.getAllProduct(this.page).subscribe({
  //       next: res=>{
  //         // this.homeService.updateProduct(res.results);
  //         this.products = [...this.products, ...res.results];
  //         this.page++;
  //         this.loading = false;
  //         this.totalProductCount = res.count;
  //       },
  //       error: err=>{
  //         this.alertService.tosterDanger('Something went wrong');
  //         this.loading = false;
  //       }
  //     })
  //   }
  // }


  goToProduct(id: number) {
    this.superUser ? this.router.navigate(['/updateProduct', id]) : this.router.navigate(['/product', id]);
  }

  onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 0;
  }

  applyFilters(): void {
    this.products = [];
    this.page = 1;
    this.updateProduct();
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
    const element = document.documentElement; // For window scroll
  
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 200;
  
    if (atBottom && !this.loading) {
      this.updateProduct();
    }
  }
  

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }  

}
