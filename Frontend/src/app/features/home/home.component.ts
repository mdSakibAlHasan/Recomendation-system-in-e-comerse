import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Product } from './home.model';
import { AlertService } from '../../shared/alert/alert.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PaginatorModule, CardModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  products: Product[] = [];
  first: number = 0;
  rows: number = 10;
  searchText: string = ''
  totalRecord: number = 0 ;
  constructor(
    private homeService: HomeService,
    private alertService: AlertService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.homeService.getAllProduct().subscribe({
      next: res=>{
        this.products = res;
        this.totalRecord = res.length;
      },
      error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    })
  }


  goToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 0;
  }

}
