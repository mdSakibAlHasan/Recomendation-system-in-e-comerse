import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddProductService } from './add-product.service';
import { AlertService } from '../../shared/alert/alert.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ProductService } from '../product/product.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit{
  productForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  category: any[] = [];
  brand: any[] = []
  id: string;

  constructor(
    private fb: FormBuilder,
    private addProductService: AddProductService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required]],
      model: ['', [Validators.required, Validators.maxLength(30)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock_items: ['', [Validators.required, Validators.min(0)]],
      BID: ['',[Validators.required]],
      CategoryID: ['',[Validators.required]],
      base_view: [null,[Validators.required]]
    });
    this.id = this.route.snapshot.paramMap.get('id')?? '0';
  }
  ngOnInit(): void {
    if(this.id !='0'){
      let product$ = this.productService.getProductById(this.id);
      let category$ = this.addProductService.getCategory();
      combineLatest([product$,category$]).subscribe(([product, category])=>{
        this.category = category;
        this.addProductService.getBrand(product[0].CategoryID).subscribe(res=>{ 
          this.brand = res;
          this.productForm.patchValue({
            CategoryID: category.find(cat => cat.id === product[0].CategoryID),
            name: product[0].name,
            description: product[0].description,
            model: product[0].model,
            price: product[0].price,
            stock_items: product[0].stock_items,
            BID: res.find(b => b.id == product[0].BID),
            base_view: product[0].base_view 
          });
        })
        this.imagePreview = product[0].base_view;
      })
    }else{
      this.addProductService.getCategory().subscribe({
        next: res=>{
          this.category = res;
        },error: err=>{
          this.alertService.tosterDanger('Something went wrong');
        }
      })
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.productForm.patchValue({ base_view: file });
    this.productForm.get('base_view')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onCategoryChange(event:any){
    this.addProductService.getBrand(event.value.id).subscribe({
      next: res=>{
        this.brand = res;
      },error: err=>{
        this.brand = []
      }
    })
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.alertService.tosterInfo('Please filup required field');
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.productForm.controls).forEach(key => {
      formData.append(key, this.productForm.get(key)?.value.id ? this.productForm.get(key)?.value.id: this.productForm.get(key)?.value);
    });

    this.addProductService.addProduct(formData).subscribe({
      next: res=>{
        this.alertService.tosterSuccess('product add complete');
        this.router.navigate(['product/'+res.id]);
      },
      error: err=>{
        this.alertService.tosterDanger(err.message)
      }
    });
  }
}
