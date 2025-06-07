import React from 'react';
import { CartSummary } from '../CartSummary/CartSummary';

export const Order = ({ products = [] }) => {

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
