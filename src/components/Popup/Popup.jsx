import React, { useEffect } from 'react';

export const Popup = ({ isOpen, onClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(onClose, 5000);
      return () => {
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <div className="popup-icon">✓</div>
        <h2>Заказ оформлен!</h2>
        <p>{message || 'Спасибо за ваш заказ! Наш менеджер свяжется с вами в ближайшее время.'}</p>
        <button className="close-button" onClick={onClose}>
           закрыть
        </button>
      </div>
    </div>
  );
};
