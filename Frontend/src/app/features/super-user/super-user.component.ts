import { Component, OnInit } from '@angular/core';
import { SuperUserService } from './super-user.service';
import { AddProductService } from '../add-product/add-product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AlertService } from '../../shared/alert/alert.service';

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
  selectedCategoryID: number = 0;
  constructor(
    private superUnitService: SuperUserService,
    private addProductService: AddProductService,
    private alertService: AlertService
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
  fetchBrands(categoryId: number) {
    this.addProductService.getBrand(categoryId).subscribe((data: any[]) => {
      this.brands = data;
    });
  }

  categoryEdit(event:any){
    console.log(event);
  }

  categoryDelete(event:any){
    console.log(event);
  }

  onCategoryChange(event: any){
    this.selectedCategory = event.value.name;
    this.selectedCategoryID = event.value.id;
    this.fetchBrands(event.value.id);
  }
    

  onAddCategory() {
    if (!this.newCategory) return;
    this.superUnitService.addCategory({"name":this.newCategory}).subscribe({
      next: res=>{
        this.alertService.tosterSuccess('Category added');
        this.getCategory();
      }, 
      error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    })
  }

  onAddBrand() {
    if (!this.newBrand || this.selectedCategory === null) return;
    this.superUnitService.addBrand(this.selectedCategoryID,{"name":this.newBrand}).subscribe({
      next: res=>{
        this.alertService.tosterSuccess('Brand added under '+this.selectedCategory);
        this.fetchBrands(this.selectedCategoryID);
      }, 
      error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    })
    // this.brandService.addBrand({ name: this.newBrand, categoryId: this.selectedCategory }).subscribe(() => {
    //   this.fetchBrands(this.selectedCategory);
    //   this.newBrand = ''; // Clear input field
    // });
  }

}
