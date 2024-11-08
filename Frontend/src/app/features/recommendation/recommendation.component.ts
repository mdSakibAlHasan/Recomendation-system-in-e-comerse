import { Component, HostListener, Input } from '@angular/core';
import { ProductModel } from '../../shared/model/product.model';
import { HomeService } from '../home/home.service';
import { Router } from '@angular/router';
import { Pagination } from '../../core/constants/general';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.css'
})
export class RecommendationComponent {
  @Input() productID: string = "0";
  products: ProductModel[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecord: number = 0 ;
  baseImgUrl = 'http://localhost:8000/'
  page = 1;
  totalProductCount: number = Infinity;
  loading = false;    //for pagination
  constructor(
    private homeService: HomeService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(){
    if((this.page*Pagination.HomePageSize)<=this.totalProductCount){
      this.loading = true;
      this.homeService.getRecommendationForYou(this.productID,this.page).subscribe({
        next: res=>{
          this.products = [...this.products, ...res.results];
          this.page++;
          this.loading = false;
          this.totalProductCount = res.count;
        },
        error: err=>{
          this.loading = false;
        }
      })
    }
  }


  goToProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 0;
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
    const element = document.documentElement; // For window scroll
  
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 200;
  
    if (atBottom && !this.loading) {
      this.loadProduct(); // Load more products when near the bottom
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }  
}
