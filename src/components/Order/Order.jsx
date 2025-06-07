import React from 'react';
import { CartSummary } from '../CartSummary/CartSummary';
import { useCart } from '../../context/CartContext';

export const Order = ({ products = [] }) => {
  const { getCartSummary } = useCart();
//   const summary = getCartSummary();
  
  return (
    <header className="header">
      <div className="container__order-summary">
        <div className="header-content">
          <div className="header-actions">
            <CartSummary products={products} />
          </div>
        </div>
      </div>
    </header>
  );
};
