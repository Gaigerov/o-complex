import { useMemo } from 'react';
import { useCart } from '../context/CartContext';

export const useCartSummary = (products) => {
  const { cart } = useCart();
  
  return useMemo(() => {
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    
    const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = products?.find(p => p.id === parseInt(id));
      return sum + (product ? product.price * qty : 0);
    }, 0);
    
    return { totalItems, totalPrice };
  }, [cart, products]);
};
