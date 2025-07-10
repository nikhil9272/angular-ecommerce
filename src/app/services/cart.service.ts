import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem) {
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined ;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
    }

    alreadyExistsInCart = existingCartItem!= undefined;

    if (alreadyExistsInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }

  }

  computeCartTotals(): void {
    let totalPrice: number = 0;
    let totalQuantity: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPrice += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantity += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);

    this.logCartData(totalPrice, totalQuantity);
  }

  logCartData(totalPrice: number, totalQuantity: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPrice.toFixed(2)}, totalQuantity: ${totalQuantity}`);
    console.log('----');
  }

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
