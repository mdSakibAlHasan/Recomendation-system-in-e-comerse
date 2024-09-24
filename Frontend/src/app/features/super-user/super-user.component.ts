import { Component, OnInit } from '@angular/core';
import { SuperUserService } from './super-user.service';
import { AddProductService } from '../add-product/add-product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AlertService } from '../../shared/alert/alert.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-super-user',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, RouterModule],
  templateUrl: './super-user.component.html',
  styleUrl: './super-user.component.css'
})
export class SuperUserComponent implements OnInit{
  superUser: boolean = false;
  category: any[] = []
  brands: any[] = [];
  newCategory: string = '';
  categoryID: number = 0;
  newBrand: string = '';
  brandID: number = 0;
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

  categoryEdit(categoryId:number, categoryName: string){
    this.categoryID = categoryId;
    this.newCategory = categoryName;
  }

  categoryDelete(categoryID:number){
    this.alertService.confirm(
			'Are you want to delete this category?',
			() => {
				this.superUnitService.deleteCategory(categoryID).subscribe({
					next: res => {
						this.alertService.tosterSuccess("Category delete complete");
            this.getCategory();
					},
					error: err => {
						this.alertService.tosterDanger(err.message);
					},
				});
			},
			() => {}
		);
  }

  onCategoryChange(event: any){
    this.selectedCategory = event.value.name;
    this.selectedCategoryID = event.value.id;
    this.fetchBrands(event.value.id);
  }

  onUpdateCategory(){
    if (!this.newCategory) return;
    this.superUnitService.updateCategory(this.categoryID,{"name":this.newCategory}).subscribe({
      next: res=>{
        this.alertService.tosterSuccess('Category updated');
        this.getCategory();
        this.categoryID = 0;
        this.newCategory = '';
      }, 
      error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    })
  }
    

  onAddCategory() {
    if (!this.newCategory) return;
    this.superUnitService.addCategory({"name":this.newCategory}).subscribe({
      next: res=>{
        this.alertService.tosterSuccess('Category added');
        this.getCategory();
        this.newCategory = '';
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
        this.newBrand = ''
      }, 
      error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    })
  }


  brandEdit(brandID:number, newBrand: string){
    this.brandID = brandID;
    this.newBrand = newBrand;
  }

  brandDelete(brandID:number){
    this.alertService.confirm(
			'Are you want to delete this brand?',
			() => {
				this.superUnitService.deleteBrand(brandID).subscribe({
					next: res => {
						this.alertService.tosterSuccess("Brand delete complete");
            this.fetchBrands(this.selectedCategoryID);
					},
					error: err => {
						this.alertService.tosterDanger(err.message);
					},
				});
			},
			() => {}
		);
  }

  onUpdateBrand(){
    if (!this.newBrand) return;
    this.superUnitService.updateBrand(this.brandID,{"name":this.newBrand}).subscribe({
      next: res=>{
        this.alertService.tosterSuccess('Brand updated');
        this.fetchBrands(this.selectedCategoryID);
        this.categoryID = 0;
        this.newBrand = '';
      }, 
      error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    })
  }

}
