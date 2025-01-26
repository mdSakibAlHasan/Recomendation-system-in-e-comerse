import { Component } from '@angular/core';
import { ProductStatusService } from './product-status.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-status.component.html',
  styleUrl: './product-status.component.css'
})
export class ProductStatusComponent {
  trendingProducts: any[] = [];
  stockOutProducts: any[] = [];

  constructor(private statusService: ProductStatusService) {}

  ngOnInit(): void {
    this.getTrendingProducts();
    this.getStockOutProducts();
  }

  getTrendingProducts(): void {
    this.statusService.getTredingProduct().subscribe(
      (response: any) => (this.trendingProducts = response.results),
      (error) => console.error('Error fetching trending products', error)
    );
  }

  getStockOutProducts(): void {
    this.statusService.getStockOutProduct().subscribe(
      (response: any) => (this.stockOutProducts = response.results),
      (error) => console.error('Error fetching stock-out products', error)
    );
  }
}
