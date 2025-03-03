import { CommonModule, Location, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProductService } from './product.service';
import { AlertService } from '../../shared/alert/alert.service';
import { RatingModule } from 'primeng/rating';
import { combineLatest, Subscription } from 'rxjs';
import { AuthGuard } from '../../core/guards/auth.guard';
import { NavbarService } from '../../shared/component/navbar/navbar.service';
import { ProductModel } from '../../shared/model/product.model';
import { RecommendationComponent } from '../recommendation/recommendation.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, ButtonModule, CommonModule, RatingModule, RecommendationComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  productId: string = '';
  isInCart = false;
  showReviewForm = false;
  reviewText: string = '';
  reviewRating: number = 0;
  product: ProductModel | undefined;
  productComment: any[] = [];
  baseImgUrl = 'http://localhost:8000/'
  private subscription$: Subscription | undefined;
  liked = false;  
  disliked = false; 
  showAllComments = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private alertService: AlertService,
    private navbarService: NavbarService,
    private location: Location,
    private authGuard: AuthGuard,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')?? '0';
    this.loadProduct();
    this.viewportScroller.scrollToPosition([0, 0]);
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProduct(); 
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  loadProduct(){
    let productComment$ = this.productService.getCommentsByProductId(this.productId);
    let products$ = this.productService.getProductById(this.productId);
    this.subscription$ = combineLatest([productComment$, products$]).subscribe(([productComment, products]) =>{
      this.product = products[0];
      this.productComment = productComment;
    });
    let cartStatus$ = this.productService.viewCartStatus(this.productId);
    let likeStatus$ = this.productService.viewLikeStatus(this.productId);
    this.subscription$ = combineLatest([cartStatus$, likeStatus$]).subscribe(([cartStatus, likeStatus]) =>{
      this.isInCart = cartStatus;
      if(likeStatus.length !=0 && likeStatus[0].preference == 1)
        this.liked = true;
      else if(likeStatus.length !=0 && likeStatus[0].preference == 2)
        this.disliked = true;
    });
  }

  toggleCart() {
    if(this.isInCart){
      this.router.navigate(['cart']);
    }else if(this.product && this.product?.stock_items==0){
      this.alertService.tosterDanger("Product is not in stock ")
    }else{
      this.authGuard.isLoggedIn().then(isLoggedIn => {
        if (!isLoggedIn) {
          return
        } else {
          const data ={
            "PID": this.productId
          }
          this.productService.addToCart(data).subscribe({
            next: res=>{
              this.isInCart = !this.isInCart;
              this.alertService.tosterSuccess('Product added in cart successfully');
              this.navbarService.updateCartNumber();
            },
            error: err=>{
              this.alertService.tosterDanger('Something went wrong');
            }
          })
        }
      });
    }
  }

  toggleReviewForm() {
    this.authGuard.isLoggedIn().then(isLoggedIn => {
      if(!isLoggedIn){
        return;
      }else{
        this.showReviewForm = !this.showReviewForm;
      }
    })
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

  toggleLike() {
    this.authGuard.isLoggedIn().then(isLoggedIn => {
      if(!isLoggedIn){
        this.alertService.tosterInfo('You need to login to like this product');
        return;
      }else{
        if (!this.liked) {
          this.productService.UpdateLikeStatus(this.productId,{"preference": "1"}).subscribe(res=>{
            this.alertService.tosterInfo('You liked this product');
            this.product ? this.product.like++: null;
            if (this.disliked) {
              this.disliked = false;
              this.product? this.product.disLike--: null;
            }
          })  
        } else {
          this.productService.deleteLikeStatus(this.productId).subscribe(res=>{
            this.alertService.tosterInfo('You removed like from this product');
            this.product ? this.product.like--: null;
          })
        }
        this.liked = !this.liked;
      }
    })
  }

  toggleDislike() {
    this.authGuard.isLoggedIn().then(isLoggedIn => {
      if(!isLoggedIn){
        this.alertService.tosterInfo('You need to login to dislike this product');
        return;
      }else{
        if (!this.disliked) {
          this.productService.UpdateLikeStatus(this.productId,{"preference": "2"}).subscribe(res=>{
            this.alertService.tosterInfo('You dislike this product');
            this.product? this.product.disLike++: null;
            if (this.liked) {
              this.liked = false;
              this.product ? this.product.like--: null;
            }
          })
        } else {
          this.productService.deleteLikeStatus(this.productId).subscribe(res=>{
            this.alertService.tosterInfo('You remove dislike from this product');
            this.product? this.product.disLike--: null;
          })
        }
        this.disliked = !this.disliked;
      }
    })
  }

  goBack() {
    this.location.back(); 
  }

  ngOnDestroy(): void {
		if (this.subscription$) this.subscription$.unsubscribe();
	}

}
