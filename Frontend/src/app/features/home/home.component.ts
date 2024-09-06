import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Product } from './home.model';
import { AlertService } from '../../shared/alert/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  products: Product[] = [];
  constructor(
    private homeService: HomeService,
    private alertService: AlertService,
  ){}

  ngOnInit(): void {
    this.homeService.getAllProduct().subscribe({
      next: res=>{
        this.products = res;
      },
      error: err=>{
        this.alertService.tosterDanger('Something went wrong');
      }
    })
  }

}
