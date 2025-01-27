import { Component } from '@angular/core';
import { ProductStatusService } from './product-status.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-status.component.html',
  styleUrl: './product-status.component.css'
})
export class ProductStatusComponent {
  trendingProducts: any[] = [];
  stockOutProducts: any[] = [];
  activeTab: string = 'trending';
  stock: number = 0;

  constructor(private statusService: ProductStatusService) {}

  ngOnInit(): void {
    this.getTrendingProducts();
    this.getStockOutProducts(0);
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
