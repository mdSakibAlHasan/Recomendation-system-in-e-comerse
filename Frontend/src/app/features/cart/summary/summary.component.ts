import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { selectedItems: any[], totalPrice: number };
    if (state) {
      this.selectedItems = state.selectedItems;
      this.totalPrice = state.totalPrice;
    }
  }

  // Mock payment function
  pay() {
    alert('Payment Successful! Your order has been placed.');
    this.router.navigate(['/']);  // Redirect to home or order confirmation page
  }
}
