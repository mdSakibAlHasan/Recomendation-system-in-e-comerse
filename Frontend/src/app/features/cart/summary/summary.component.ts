import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { AlertService } from '../../../shared/alert/alert.service';
import { NavbarService } from '../../../shared/component/navbar/navbar.service';

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
    private cartService: CartService,
    private alertService: AlertService,
    private navbarService: NavbarService
  ) {}

  ngOnInit(): void {
    this.selectedItems = this.cartService.getSelectedItems();
    this.totalPrice = this.selectedItems.reduce((sum, item) => {
      return sum + item.quantity * parseFloat(item.PID.price);
    }, 0);
  }

  // Mock payment function
  pay() {
    let items: any[] = [];
    this.selectedItems?.map(item=>{
      let data = {
        "id": item.id,
        "quantity": item.quantity,
        "status": 'O'
      }
      items.push(data)
    })
    this.cartService.updateCartItems(items).subscribe({
      next: res=>{
        this.alertService.tosterSuccess('Payment Successful! Your order has been placed.');
        this.navbarService.updateCartNumber();
        this.router.navigate(['/']); 
      },
      error: err=>{
        this.alertService.tosterDanger('SOmething went wrong')
      }
    })
  }
}
