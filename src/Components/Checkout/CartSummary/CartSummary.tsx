import React, { useEffect, useState } from 'react';
import { Address, Cart } from '../../../Interfaces/interfaces';
import { fetchAndHandleCart, getCartItems  } from '../../../Helpers/cart';
import './CartSummary.css';
import { getServerUrlPrefix } from '../../../Config/clientSettings';
import { useNavigate } from 'react-router-dom';

export default function CartSummary({
  isCheckoutView,
  address,
  paymentIntentToken,
  setPaymentIntentToken
}:{
  isCheckoutView:boolean,
  paymentIntentToken?:string,
  address?:Address,
  setPaymentIntentToken?:Function
}){
  const navigate = useNavigate();
  const [cart,setCart] = useState<Cart>({
    totalQuantity: 0,
    items: [],
    tax: 0,
    subtotal: 0
  });
  const [cartSubtotalPrice,setCartSubtotalPrice] = useState<number>(0);
  const [taxPrice,setTaxPrice] = useState<number>(0);

  const populateTaxCalculation = async function(address:Address){
    const response = await fetch(`${getServerUrlPrefix()}/api/shop/carts/create-tax-calculation`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('loginToken')}`,
        'Cart-Token': `Bearer ${localStorage.getItem('cartToken')}`
      },
      body: JSON.stringify({
        address: address,
        clientSecret: paymentIntentToken
      })
    });
    const responseData = await response.json();
    setCartSubtotalPrice(responseData.total/100);
    setTaxPrice(responseData.taxAmount/100);
    if (setPaymentIntentToken) setPaymentIntentToken(responseData.paymentIntentToken);
  };

  useEffect(()=>{
    if (address && address.city && address.country && address.line1 && address.postal_code && address.state) populateTaxCalculation(address);
  },[address])

  //handle initial page load (grab latest cart data);
  useEffect(()=>{
    fetchAndHandleCart(setCart);
  },[]);

  //when the cart is updated, update the total price of all items in the cart
  useEffect(()=>{
    setCartSubtotalPrice(cart.subtotal);
  },[cart])

  //handle empty shopping cart
  if (cart.items.length===0){
    return(
      <div className='cart-summary'>
        <h3>Basket</h3>
        <strong>Your Basket is Currently Empty.</strong>
      </div>
    );
  }else if (cart.items.length>0 && !isCheckoutView){
    return(
      <section className='cart-summary'>
        <h3>Basket</h3>
        <table>
          <thead>
            <tr>
              <th className="item-name">Name</th>
              <th className="item-quantity">Quantity</th>
              <th className="item-subtotal">Subtotal</th>
              <th className="item-remove">Remove</th>
            </tr>
          </thead>
          <tbody>
            {getCartItems(cart.items,setCart,isCheckoutView)}
          </tbody>
        </table>
        <div className='cart-subtotal'>
          <span><strong>Basket Subtotal: ${cartSubtotalPrice.toFixed(2)}</strong></span>
        </div>
        <b className='cart-shipping-note'>Note: Shipping and taxes are calculated at checkout.</b>
        {/* <button onClick={()=>{alert("We appreciate your interest in our delicious bagels! Although we're not officially open yet, we're still accepting orders. Feel free to contact sales@nybagelsclub.com to place any orders.")}}>Checkout</button> */}
        <button onClick={()=>{navigate('/cart/checkout')}}>Checkout</button>
      </section>
    );
  }else{ //is checkout view
    return(
      <section className='cart-summary checkout-cart-summary'>
        <h3>Final Basket Summary</h3>
        <table>
          <thead>
            <tr>
              <th className="item-name">Name</th>
              <th className="item-quantity">Quantity</th>
              <th className="item-subtotal">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {getCartItems(cart.items,setCart,isCheckoutView)}
          </tbody>
        </table>
        <div className='cart-subtotal'>
          <span><strong>Basket Subtotal: ${(cartSubtotalPrice - taxPrice).toFixed(2)}</strong></span>
          <span><strong>Calculated Tax: ${taxPrice.toFixed(2) || '0.00'}</strong></span>
          <span><strong>Basket Total: ${(cartSubtotalPrice).toFixed(2)}</strong></span>
        </div>
      </section>
    )
  };
};