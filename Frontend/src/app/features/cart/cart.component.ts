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

  incrementQuantity(item: any) {
    item.quantity += 1;
    this.calculateTotal();
  }

  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.totalPrice = this.selectedItems.reduce((sum, item) => {
      return sum + item.quantity * parseFloat(item.PID.price);
    }, 0);
  }

  selectItem(item: any) {
    if (this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
    } else {
      this.selectedItems.push(item);
    }
    this.calculateTotal()
  }

  deleteItem(index: number) {
    this.cartItems.splice(index, 1); // Remove the item at the given index
  }

  goToSummary() {
    this.cartService.selectedItems = this.selectedItems;
    this.cartService.totalPrice = this.totalPrice;
    this.router.navigate(['/summary']);
  }
}
