import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface WishlistItem {
  _id: string; // Match your actual ID property
  title: string;
  price: number;
  // Add other properties
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private storageKey = 'wishlist';
  private wishlistItems: WishlistItem[] = [];
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  getWishlist() {
    return this.wishlistSubject.asObservable();
  }

  addToWishlist(item: WishlistItem): void {
    if (!this.wishlistItems.some((i) => i._id === item._id)) {
      this.wishlistItems.push(item);
      this.update();
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistItems = this.wishlistItems.filter(
      (item) => item._id !== productId
    );
    this.update();
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.storageKey);
    this.wishlistItems = saved ? JSON.parse(saved) : [];
    this.wishlistSubject.next(this.wishlistItems);
  }

  private update(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishlistItems));
    this.wishlistSubject.next(this.wishlistItems);
  }
}
