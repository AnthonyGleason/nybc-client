import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
//import components
import Nav from './Components/Nav/Nav';
import Footer from './Components/Home/Footer/Footer';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import CartSummary from './Components/Checkout/CartSummary/CartSummary';
import Checkout from './Components/Checkout/Checkout';

//import css
import './index.css';
import CheckoutSuccess from './Components/Checkout/CheckoutSuccess/CheckoutSuccess';
import SubscriptionPage from './Components/Accounts/SubscriptionPage/SubscriptionPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/subscribe' element={<SubscriptionPage />} />
        <Route path='/cart/checkout/success' element={<CheckoutSuccess />} />
        <Route path='/cart/checkout' element={<Checkout />} />
        <Route path='/cart' element={<CartSummary isCheckoutView={false} />} />
      </Routes>
      <Footer />
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();