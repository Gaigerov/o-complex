/**
 * Получение отзывов
 * @returns {Promise<Array>}
 */

export const fetchReviews = async () => {
  try {
    const response = await fetch('http://o-complex.com:1337/reviews');
    if (!response.ok) throw new Error('Ошибка загрузки отзывов');
    return await response.json();
  } catch (error) {
    console.error('fetchReviews error:', error);
    return [];
  }
};

/**
 * Получение списка товаров
 * @param {number} page - Номер страницы
 * @param {number} page_size - Количество товаров на странице
 * @returns {Promise<Object>}
 */

export const fetchProducts = async (page = 1, page_size = 6) => {
  try {
    const response = await fetch(
      `http://o-complex.com:1337/products?page=${page}&page_size=${page_size}`
    );
    if (!response.ok) throw new Error('Ошибка загрузки товаров');
    return await response.json();
  } catch (error) {
    console.error('fetchProducts error:', error);
    return { items: [], total: 0, page: 1, amount: 0 };
  }
};

/**
 * Отправка заказа
 * @param {string} phone - Номер телефона
 * @param {Array} cartItems - Элементы корзины
 * @returns {Promise<Object>}
 */

export const submitOrder = async (phone, cartItems) => {
  try {
    const response = await fetch('http://o-complex.com:1337/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone.replace(/\D/g, ''),
        cart: cartItems,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка оформления заказа');
    }

    return await response.json();
  } catch (error) {
    console.error('submitOrder error:', error);
    return { success: 0, error: error.message };
  }
};
