import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddProductService } from './add-product.service';
import { AlertService } from '../../shared/alert/alert.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  productForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

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
      BID: ['', [Validators.required]],
      CategoryID: ['', [Validators.required]],
      base_view: [null]
    });
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

  onSubmit() {
    if (this.productForm.invalid) {
      this.alertService.tosterInfo('Please filup required field');
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.productForm.controls).forEach(key => {
      formData.append(key, this.productForm.get(key)?.value);
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
