import React, {Suspense, lazy} from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import './index.css';

//import components
const CornerButtons = lazy(()=> import('./Components/Home/Menu/CornerButtons/CornerButtons'));
const Nav = lazy(() => import('./Components/Nav/Nav'));
const Home = lazy(() => import('./Components/Home/Home'));
const Login = lazy(() => import('./Components/Login/Login'));
const Register = lazy(() => import('./Components/Register/Register'));
const CheckoutSuccess = lazy(() => import('./Components/Checkout/CheckoutSuccess/CheckoutSuccess'));
const MyOrders = lazy(() => import('./Components/Accounts/MyOrders/MyOrders'));
const AccountSettings = lazy(() => import('./Components/Accounts/AccountSettings/AccountSettings'));
const ResetPassword = lazy(() => import('./Components/Accounts/ResetPassword/ResetPassword'));
const Admin = lazy(() => import('./Components/Admin/Admin'));
const Support = lazy(() => import('./Components/Support/Support'));
const CartSummary = lazy(() => import('./Components/Checkout/CartSummary/CartSummary'));
const Footer = lazy(()=>import('./Components/Home/Footer/Footer'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={ //not suspending this so page loads in the background
          <>
            <Nav />
            <Home />
            <Footer />
            <CornerButtons />
          </>
        } />
        <Route
          path='/admin'
          element={
              <Suspense>
                <Nav />
                <Admin />
                <Footer />
              </Suspense>
          }
        />
        <Route
          path='/login'
          element={
              <Suspense >
                <Nav />
                <Login />
                <Footer />
              </Suspense>
          }
        />
        <Route
          path='/register'
          element={
              <Suspense>
                <Nav />
                <Register />
                <Footer />
              </Suspense>
          }
        />
        <Route
          path='/cart/checkout/success/:pendingOrderDocID'
          element={
              <Suspense>
                <Nav />
                <CheckoutSuccess />
                <Footer />
              </Suspense>
          }
        />
        <Route
          path='/cart'
          element={
              <Suspense>
                <Nav />
                <CartSummary />
                <Footer />
              </Suspense>
          }
        />
        <Route
          path='/accounts/password/reset/:resetID'
          element={
              <Suspense>
                <Nav />
                <ResetPassword />
                <Footer />
              </Suspense>
          }
        />
        <Route
          path='/accounts/orders'
          element={
              <Suspense>
                <Nav />
                <MyOrders />
                <Footer />
              </Suspense>
          }
        />
        <Route
          path='/accounts/settings'
          element={
              <Suspense>   
                <Nav />
                <AccountSettings />
                <Footer />
              </Suspense>
          }
        />
        <Route
          path='/support'
          element={
              <Suspense>
                <Nav />
                <Support />
                <Footer />
              </Suspense>
          }
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
