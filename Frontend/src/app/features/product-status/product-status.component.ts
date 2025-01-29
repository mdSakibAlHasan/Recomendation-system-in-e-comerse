import { Component } from '@angular/core';
import { ProductStatusService } from './product-status.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { error } from 'node:console';

@Component({
  selector: 'app-product-status',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule],
  templateUrl: './product-status.component.html',
  styleUrl: './product-status.component.css'
})
export class ProductStatusComponent {
  trendingProducts: any[] = [];
  stockOutProducts: any[] = [];
  activeTab: string = 'trending';
  stock: number = 0;
  rules:any[] = []

  constructor(
    private statusService: ProductStatusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTrendingProducts();
    this.getStockOutProducts(0);
    this.getAprioriData();
  }

  getTrendingProducts(): void {
    this.statusService.getTredingProduct().subscribe(
      (response: any) => (this.trendingProducts = response.results),
      (error) => console.error('Error fetching trending products', error)
    );
  }

  getStockOutProducts(size: number): void {
    this.statusService.getStockOutProduct(size).subscribe(
      (response: any) => (this.stockOutProducts = response.results),
      (error) => console.error('Error fetching stock-out products', error)
    );
  }

  status(form: { value: any; }) {
    let data = form.value
    this.getStockOutProducts(data.stock);
  }

  goToEdit(id: number) {
    this.router.navigate(['/updateProduct', id]);
  }

  goToProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  getAprioriData(){
    this.statusService.getAprioriData().subscribe(
      res=>{
        this.rules = res;
      },
      error=>{

      }
    )
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
