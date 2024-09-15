import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProductService } from './product.service';
import { AlertService } from '../../shared/alert/alert.service';
import { Product } from '../home/home.model';
import { RatingModule } from 'primeng/rating';
import { combineLatest, Subscription } from 'rxjs';
import { AuthGuard } from '../../core/guards/auth.guard';
import { NavbarService } from '../../shared/component/navbar/navbar.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, ButtonModule, CommonModule, RatingModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  productId: string = '';
  isInCart = false;
  showReviewForm = false;
  reviewText: string = '';
  reviewRating: number = 0;
  product: Product | undefined;
  productComment: any[] = [];
  private subscription$: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private alertService: AlertService,
    private location: Location,
    private navbarService: NavbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')?? '0';
    let productComment$ = this.productService.getCommentsByProductId(this.productId);
    let products$ = this.productService.getProductById(this.productId);
    this.subscription$ = combineLatest([productComment$, products$]).subscribe(([productComment, products]) =>{
      this.product = products[0];
      this.productComment = productComment;
    })
  }

  toggleCart() {
    this.navbarService.loginData$.subscribe((loginStatus) => {
      debugger
      if(!loginStatus){
        this.router.navigate(['account/login']);
        return ;
      }

      const data ={
        "PID": this.productId
      }
      this.productService.addToCart(data).subscribe({
        next: res=>{
          this.isInCart = !this.isInCart;
          this.alertService.tosterSuccess('Product added in cart successfully');
        },
        error: err=>{
          this.alertService.tosterDanger('Something went wrong');
        }
      })
    });
  }

  toggleReviewForm() {
    this.navbarService.loginData$.subscribe((loginStatus) => {
      debugger
      if(!loginStatus){
        this.router.navigate(['account/login']);
        return;
      }else{
        this.showReviewForm = !this.showReviewForm;
      }
    }); 
  }

  submitReview() {
    if (this.reviewText.trim() && this.reviewRating > 0) {
      const data = {
        "comment": this.reviewText,
        "review": this.reviewRating,
      }
      this.productService.createComment(data, Number(this.productId)).subscribe({
        next: res=>{
          this.alertService.tosterSuccess('Review Write complete');
          this.reviewText = '';
          this.showReviewForm = false;
          this.reviewRating = 0;
          this.ngOnInit();
        },
        error: err=>{
          this.alertService.tosterDanger('Something went wrong');
        }
      })
      
    } else {
      this.alertService.tosterDanger('Please fill up all field')
    }
  }

  goBack() {
    this.location.back(); // This will navigate back to the previous page
  }

  ngOnDestroy(): void {
		if (this.subscription$) this.subscription$.unsubscribe();
	}

}
