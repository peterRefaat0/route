import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/whishlist.service';


@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrls: ['./nav-blank.component.scss'],
})
export class NavBlankComponent implements OnInit {
  constructor(
    private _Router: Router,
    private _CartService: CartService,
    private _Renderer2: Renderer2,
    private _WhishlistService: WishlistService,
  ) {}

  @ViewChild('navBar') navElement!: ElementRef; // element

  @HostListener('window:scroll')
  onScroll(): void {
    if (scrollY > 500) {
      this._Renderer2.addClass(this.navElement.nativeElement, 'px-5');

      this._Renderer2.addClass(this.navElement.nativeElement, 'shadow');
    } else {
      this._Renderer2.removeClass(this.navElement.nativeElement, 'px-5');
      this._Renderer2.removeClass(this.navElement.nativeElement, 'shadow');
    }
  }
  favNum: number = 0;
  cartNum: number = 0;

  ngOnInit(): void {
    this._WhishlistService.getWishlist().subscribe({
      next: (data) => {
        this.favNum = data.length;
      },
    });
    this._CartService.cartNumber.subscribe({
      next: (data) => {
        this.cartNum = data;
      },
    });

    this._CartService.getCartUser().subscribe({
      next: (response) => {
        this.cartNum = response.numOfCartItems;
      },
    });
  }

  signOut(): void {
    localStorage.removeItem('etoken');
    this._Router.navigate(['/login']);
  }
}
