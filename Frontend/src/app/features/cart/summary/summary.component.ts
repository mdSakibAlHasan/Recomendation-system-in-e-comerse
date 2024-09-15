import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  selectedItems: any[] = [];
  totalPrice: number = 0;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.selectedItems = this.cartService.getSelectedItems();
    console.log(this.selectedItems)
    this.selectedItems?.forEach(item => {
      this.totalPrice += item.quantity * parseFloat(item.PID.price); // Ensure price is parsed as a number
    });
  }

  // Mock payment function
  pay() {
    alert('Payment Successful! Your order has been placed.');
    this.router.navigate(['/']);  // Redirect to home or order confirmation page
  }
}
