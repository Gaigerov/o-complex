import React, {useState} from 'react';
import {IMaskInput} from 'react-imask';
import {useCart} from '../../context/CartContext';
import {submitOrder} from '../../utils/api';

export const PhoneForm = ({onSuccess}) => {
    const {cart, clearCart} = useCart();
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Валидация телефона
        const cleanedPhone = phone.replace(/\D/g, '');
        if (cleanedPhone.length !== 11) {
            setError('Введите полный номер телефона');
            return;
        }

        // Формирование корзины
        const cartItems = Object.entries(cart)
            .filter(([_, qty]) => qty > 0)
            .map(([id, quantity]) => ({id: parseInt(id), quantity}));

        if (cartItems.length === 0) {
            setError('Добавьте товары в корзину');
            return;
        }

        // Отправка заказа
        setIsSubmitting(true);
        try {
            const result = await submitOrder(cleanedPhone, cartItems);

            if (result.success) {
                clearCart();
                onSuccess('Ваш заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
            } else {
                setError(result.error || 'Ошибка оформления заказа');
            }
        } catch (err) {
            setError('Сетевая ошибка');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="phone-form">
            <div className='phone-form__inputContainer'>
            <IMaskInput
                mask="+7 (000) 000-00-00"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onAccept={(value) => setPhone(value)}
                className={error ? 'error' : 'inputPlaceholder'}
            />
            {error && <div className="error-message">{error}</div>}
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'отправка...' : 'заказать'}
            </button>
        </form>
    );
};