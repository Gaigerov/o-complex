import React from 'react';
import { useCart } from '../../context/CartContext';

// Компонент-скелетон для загрузки
const SummarySkeleton = () => (
  <div className="skeleton-summary">
    <div className="skeleton-line" style={{ width: '80px' }}></div>
    <div className="skeleton-line" style={{ width: '60px' }}></div>
  </div>
);

export const CartSummary = ({ products = [] }) => {
  const { cart, isClient } = useCart();
  
  // Создаем карту продуктов для быстрого доступа
  const productMap = React.useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
  }, [products]);

  // Рассчет итогов с защитой от SSR
  const { totalItems, totalPrice } = React.useMemo(() => {
    if (!isClient) {
      return { totalItems: 0, totalPrice: 0 };
    }
    
    const items = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const price = Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = productMap[parseInt(id)];
      return sum + (product ? product.price * qty : 0);
    }, 0);
    
    return {
      totalItems: items,
      totalPrice: price
    };
  }, [cart, productMap, isClient]);

  // Форматирование цены
  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(totalPrice);

  if (!isClient) {
    return <SummarySkeleton />;
  }

  return (
    <div className="cart-summary">
        <div className='cart-summary__title' >Добавленные товары</div>
      <div className="summary-item">
        <span>Товаров:</span>
        <span>{totalItems} шт.</span>
      </div>
      <div className="summary-item">
        <span>Сумма:</span>
        <span>{formattedPrice}</span>
      </div>
    </div>
  );
};

export default CartSummary;
