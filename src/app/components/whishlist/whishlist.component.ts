import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from 'src/app/core/services/whishlist.service';
import { Product } from 'src/app/core/interfaces/product';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CuttextPipe } from 'src/app/core/pipe/cuttext.pipe';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-whishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, CuttextPipe],
  templateUrl: './whishlist.component.html',
  styleUrls: ['./whishlist.component.scss'],
})
export class WhishlistComponent implements OnInit {
  constructor(
    private _wishlistService: WishlistService,
    private _ToastrService: ToastrService,
    private _Renderer2: Renderer2,
    private _CartService: CartService
  ) {}

  products: Product[] = [];
  wishListData: string[] = []; // Data ---> wishlist -> add , remove  ["id","id","id"]

  ngOnInit(): void {
    this._wishlistService.getWishlist().subscribe({
  next: (response) => {
    console.log(response);
    this.wishListData = response; // تأكد من التعامل مع البيانات المرتجعة بشكل صحيح
  },
  error: (err) => {
    console.error('Error fetching wishlist', err);
  }
});
  }

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

  addFav(prodId: string | undefined): void {
    this._wishlistService.addToWishlist(prodId).subscribe({
      next: (response) => {
        console.log(response);
        this._ToastrService.success(response.message);
        this.wishListData = response.data; // ["id","id","id"] --> wishlist
      },
    });
  }

  removeFav(prodId: string | undefined): void {
    // تحقق مما إذا كان prodId موجودًا
    if (prodId) {
      this._wishlistService.removeFromWishlist(prodId).subscribe({
        next: (response) => {
          console.log(response);
          this._ToastrService.success(response.message);
          this.wishListData = response.data; // ["id", "id", "id"] --> wishlist
  
          // المنتجات  --> [{} , {} , {}]
          const newProductsData = this.products.filter((item: any) =>
            this.wishListData.includes(item._id)
          );
  
          this.products = newProductsData;
        },
        error: (err) => {
          console.error('Error removing item from wishlist', err); // في حالة حدوث خطأ
        },
      });
    } else {
      console.error('Product ID is undefined'); // طباعة رسالة إذا كانت القيمة غير موجودة
    }
  }
  
}
