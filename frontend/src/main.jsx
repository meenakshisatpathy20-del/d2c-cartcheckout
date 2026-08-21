import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { CheckoutProvider } from './context/CheckoutContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <CheckoutProvider>
        <App />
      </CheckoutProvider>
    </CartProvider>
  </React.StrictMode>
);