import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/interfaces/product';
import { RouterLink } from '@angular/router';
import { CuttextPipe } from 'src/app/core/pipe/cuttext.pipe';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/core/services/cart.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, CuttextPipe, NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private _ProductService: ProductService,
    private _CartService: CartService,
    private _ToastrService: ToastrService,
    private _Renderer2: Renderer2
  ) {}

  products: Product[] = [];
  pageSize: number = 0; //limit
  curentPage: number = 1;
  total: number = 0;

  ngOnInit(): void {
    this._ProductService.getProducts().subscribe({
      next: (response) => {
        console.log('products', response.data);
        this.products = response.data;
        this.pageSize = response.metadata.limit;
        this.curentPage = response.metadata.currentPage;
        this.total = response.results;
      },
    });
  }

  //                  button refrence (btnAdd)
  addProduct(id: any, element: HTMLButtonElement): void {
    this._Renderer2.setAttribute(element, 'disabled', 'true');

    this._CartService.addToCart(id).subscribe({
      next: (response) => {
        console.log(response);
        console.log(response.message);
        this._ToastrService.success(response.message);
        this._Renderer2.removeAttribute(element, 'disabled');

        this._CartService.cartNumber.next(response.numOfCartItems);
      },
      error: (err) => {
        this._Renderer2.removeAttribute(element, 'disabled');
      },
    });
  }

  pageChanged(event: any): void {
    this._ProductService.getProducts(event).subscribe({
      next: (response) => {
        console.log('products', response.data);
        this.products = response.data;
        this.pageSize = response.metadata.limit;
        this.curentPage = response.metadata.currentPage;
        this.total = response.results;
      },
    });
  }
}
