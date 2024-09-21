import { Component, OnInit } from '@angular/core';
import { SuperUserService } from './super-user.service';
import { AddProductService } from '../add-product/add-product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-super-user',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './super-user.component.html',
  styleUrl: './super-user.component.css'
})
export class SuperUserComponent implements OnInit{
  superUser: boolean = false;
  category: any[] = []
  brands: any[] = [];
  newCategory: string = '';
  newBrand: string = '';
  selectedCategory: string = '';
  constructor(
    private superUnitService: SuperUserService,
    private addProductService: AddProductService
  ){}

  ngOnInit(): void {
    this.addProductService.getUserDetails().subscribe(res=>{
      res[0].userType === 'S' ? this.superUser = true: null;
      if(this.superUser){
        this.getCategory();
      }
    })
  }

  getCategory(){
    this.addProductService.getCategory().subscribe(category=>{
      this.category = category;
    })
  }

  onCategoryChange(event: any){
    this.selectedCategory = event.value.name;
    this.fetchBrands(event.value.id);
  }

  fetchBrands(categoryId: number) {
    this.addProductService.getBrand(categoryId).subscribe((data: any[]) => {
      this.brands = data;
    });
  }

  onAddCategory() {
    if (!this.newCategory) return;
    // this.categoryService.addCategory({ name: this.newCategory }).subscribe(() => {
    //   this.fetchCategories();
    //   this.newCategory = ''; // Clear input field
    // });
  }

  onAddBrand() {
    if (!this.newBrand || this.selectedCategory === null) return;

    // this.brandService.addBrand({ name: this.newBrand, categoryId: this.selectedCategory }).subscribe(() => {
    //   this.fetchBrands(this.selectedCategory);
    //   this.newBrand = ''; // Clear input field
    // });
  }

}
