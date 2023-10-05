import React, { useEffect, useState } from 'react';
import { Address, Item } from '../../../Interfaces/interfaces';
import { fetchAndHandleCart, getCartItems,getCartSubtotalPrice  } from '../../../Helpers/cart';
import { useNavigate } from 'react-router-dom';
import './CartSummary.css';
import { getServerUrlPrefix } from '../../../Config/clientSettings';

export default function CartSummary({
  isCheckoutView,
  address,
  setPaymentIntentToken
}:{
  isCheckoutView:boolean,
  address?:Address
  setPaymentIntentToken?:Function
}){
  const navigate = useNavigate();
  const [cart,setCart] = useState<Item[]>([]);
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
        address: address
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
    setCartSubtotalPrice(getCartSubtotalPrice(cart));
  },[cart])

  //handle empty shopping cart
  if (cart.length===0){
    return(
      <div className='cart-summary'>
        <h3>Basket</h3>
        <strong>Your Basket is Currently Empty.</strong>
      </div>
    );
  }else if (cart.length>0 && !isCheckoutView){
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
            {getCartItems(cart,setCart,isCheckoutView)}
          </tbody>
        </table>
        <div className='cart-subtotal'>
          <span><strong>Basket Subtotal: ${cartSubtotalPrice.toFixed(2)}</strong></span>
        </div>
        <b className='cart-shipping-note'>Note: Shipping and taxes are calculated at checkout.</b>
        <button onClick={()=>{navigate('/cart/checkout')}}>Checkout Now</button>
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
            {getCartItems(cart,setCart,isCheckoutView)}
          </tbody>
        </table>
        <div className='cart-subtotal'>
          <span><strong>Calculated Tax: ${taxPrice.toFixed(2) || '0.00'}</strong></span>
          <span><strong>Basket Total: ${(cartSubtotalPrice).toFixed(2)}</strong></span>
        </div>
      </section>
    )
  };
};