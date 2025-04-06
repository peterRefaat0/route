import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistItems: any[] = [];
  private wishlistSubject = new BehaviorSubject<any[]>([]);

  getWishlist(): Observable<any[]> {
    return this.wishlistSubject.asObservable();
  }

  addToWishlist(item: any): Observable<any> {
    this.wishlistItems.push(item);
    this.wishlistSubject.next(this.wishlistItems);

    const response = {
      message: 'Item added to wishlist successfully',
      data: this.wishlistItems,
    };

    return of(response); // 👈 بيرجع Observable تقدر تعمل عليه subscribe
  }

  removeFromWishlist(productId: string): Observable<any> {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    this.wishlistSubject.next(this.wishlistItems);

    const response = {
      message: 'Item removed from wishlist',
      data: this.wishlistItems,
    };

    return of(response);
  }
}
