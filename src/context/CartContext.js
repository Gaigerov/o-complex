import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [cart, setCart] = useLocalStorage('cart', {});

  // Определяем, что мы на клиенте после монтирования
  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCart(prev => ({ 
      ...prev, 
      [productId]: quantity 
    }));
  }, [setCart]);

  const removeItem = useCallback((productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  }, [setCart]);

  const clearCart = useCallback(() => {
    setCart({});
  }, [setCart]);

  return (
    <CartContext.Provider value={{ 
      cart: isClient ? cart : {}, // На сервере всегда пустая корзина
      isClient,
      updateQuantity, 
      removeItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
