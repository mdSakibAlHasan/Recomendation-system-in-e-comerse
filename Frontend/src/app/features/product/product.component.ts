import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, ButtonModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  productId: string = '';
  product = {
    name: 'Sample Product',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 299.99,
    imageUrl: 'https://via.placeholder.com/400x400'
  };
  isInCart = false;
  showReviewForm = false;
  reviewText = '';

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')?? '0';
    console.log('Product ID:', this.productId);
  }

  toggleCart() {
    this.isInCart = !this.isInCart;
  }

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview() {
    if (this.reviewText.trim()) {
      alert('Review submitted: ' + this.reviewText);
      this.reviewText = ''; // Clear the input
      this.showReviewForm = false; // Hide the form
    } else {
      alert('Please write a review before submitting.');
    }
  }

}
