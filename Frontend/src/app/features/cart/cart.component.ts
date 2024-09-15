import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/alert/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  totalPrice: number = 0;
  selectedItems: any[] = [];

  constructor(
    private cartService: CartService, 
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItem().subscribe({
      next: res=>{
        this.cartItems = res;
        this.calculateTotal();
      },
      error: err=>{
        this.alertService.tosterDanger('Something went wrong')
      }
    });
  }

  // Increment quantity
  incrementQuantity(item: any) {
    item.quantity += 1;
    this.calculateTotal();
  }

  // Decrement quantity
  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.calculateTotal();
    }
  }

  // Calculate total price
  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => {
      return sum + item.quantity * parseFloat(item.PID.price);
    }, 0);
  }

  // Select items for summary
  selectItem(item: any) {
    if (this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
    } else {
      this.selectedItems.push(item);
    }
  }

  // Navigate to summary page
  goToSummary() {
    this.cartService.selectedItems = this.selectedItems;
    this.router.navigate(['/summary'], { state: { selectedItems: this.selectedItems, totalPrice: this.totalPrice } });
  }
}
