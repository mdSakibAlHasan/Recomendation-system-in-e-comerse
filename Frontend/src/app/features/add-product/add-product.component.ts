import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddProductService } from './add-product.service';
import { AlertService } from '../../shared/alert/alert.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

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

  constructor(
    private fb: FormBuilder,
    private addProductService: AddProductService,
    private alertService: AlertService,
    private router: Router
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
  }
  ngOnInit(): void {
    this.addProductService.getCategory().subscribe({
      next: res=>{
        this.category = res;
      },error: err=>{
        this.alertService.tosterDanger('Something wenr wrong');
      }
    })
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
