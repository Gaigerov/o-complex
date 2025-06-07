import React from 'react';
import {useCart} from '../../context/CartContext';

// Компонент-скелетон для загрузки
const SummarySkeleton = () => (
    <div className="skeleton-summary">
        <div className="skeleton-line" style={{width: '80px'}}></div>
        <div className="skeleton-line" style={{width: '60px'}}></div>
    </div>
);

export const CartSummary = ({products = []}) => {
    const {cart, isClient} = useCart();

    // Создаем карту продуктов для быстрого доступа
    const productMap = React.useMemo(() => {
        return products.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
        }, {});
    }, [products]);

    // Рассчет корзины с детализацией по товарам
    const {cartItems, totalItems, totalPrice} = React.useMemo(() => {
        if (!isClient) {
            return {cartItems: [], totalItems: 0, totalPrice: 0};
        }

        const items = [];
        let totalItemsCount = 0;
        let totalPriceSum = 0;

        Object.entries(cart).forEach(([id, qty]) => {
            const productId = parseInt(id);
            const product = productMap[productId];

            if (product && qty > 0) {
                const itemTotal = product.price * qty;
                items.push({
                    id: productId,
                    title: product.title,
                    quantity: qty,
                    price: product.price,
                    total: itemTotal
                });

                totalItemsCount += qty;
                totalPriceSum += itemTotal;
            }
        });

        return {
            cartItems: items,
            totalItems: totalItemsCount,
            totalPrice: totalPriceSum
        };
    }, [cart, productMap, isClient]);

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
      <div className='cart-summary__title'>Добавленные товары</div>
      
      {cartItems.length === 0 ? (
        <div className="cart-empty">Корзина пуста</div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__title">{item.title}</div>
                <div className="cart-item__details">
                  <span>x{item.quantity}</span>
                  <span className="cart-item__total">
                    {item.total.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-totals">
            <div className="summary-item">
              <span>Всего товаров:</span>
              <span>{totalItems} шт.</span>
            </div>
            <div className="summary-item">
              <span>Общая сумма:</span>
              <span>{formattedPrice}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
