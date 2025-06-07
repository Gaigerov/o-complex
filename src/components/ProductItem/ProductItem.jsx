import React, {useState, useEffect} from 'react';
import {useCart} from '../../context/CartContext';
import Image from 'next/image';
import chimpSvg from '../../image/chimp.svg'

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
            <div className="product-image">
                <Image
                    src={chimpSvg}
                    alt={product.title}
                    width={200}
                    height={200}
                    layout="responsive"
                />
            </div>
            
            <div className="product-content">
                <div className="product-text">
                    <h3>{product.title}</h3>
                    {product.description && (
                        <p className="description">{product.description}</p>
                    )}
                </div>
                
                <div className="product-bottom">
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
            </div>
        </div>
    );
};
