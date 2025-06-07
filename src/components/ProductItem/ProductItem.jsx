import React, {useState, useEffect} from 'react';
import {useCart} from '../../context/CartContext';

export const ProductItem = ({product}) => {
    const {cart, updateQuantity} = useCart();
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState('');

    const quantity = cart[product.id] || 0;

    useEffect(() => {
        setIsEditing(quantity > 0);
        setLocalValue(quantity);
    }, [quantity]);

    const handleBuyClick = () => {
        updateQuantity(product.id, 1);
    };

    const handleChange = (e) => {
        let value = e.target.value;

        if (value === '') {
            setLocalValue('');
            return;
        }

        value = parseInt(value);
        if (isNaN(value)) value = 0;
        value = Math.max(0, value);

        setLocalValue(value);
        updateQuantity(product.id, value);
    };

    const handleBlur = () => {
        if (localValue === '' || parseInt(localValue) === 0) {
            updateQuantity(product.id, 0);
        }
    };

    return (
        <div className="product-card">
            <img
                src={product.image_url}
                alt={product.title}
                className='product-card__image'
            />
            <h3>{product.title}</h3>

            {product.description && (
                <p className="description">{product.description}</p>
            )}

            <div className="price">цена: {product.price.toLocaleString()}₽</div>

            {!isEditing ? (
                <button
                    className="buy-button"
                    onClick={handleBuyClick}
                    disabled={quantity > 0}
                >
                    {quantity > 0 ? 'В корзине' : 'купить'}
                </button>
            ) : (
                <div className="quantity-control">
                    <button 
                        className='quantity-button' 
                        onClick={() => updateQuantity(product.id, quantity > 1 ? quantity - 1 : 0)}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        min="0"
                        value={quantity}
                        className='quantity-input'
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <button 
                        className='quantity-button' 
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    );
};
