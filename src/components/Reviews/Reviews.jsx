import React, { useState, useRef, useEffect } from 'react';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export const Reviews = ({ initialReviews = [] }) => {
  const [expandedId, setExpandedId] = useState(null);
  const reviewRefs = useRef([]);
  
  useEffect(() => {
    reviewRefs.current = reviewRefs.current.slice(0, initialReviews.length);
  }, [initialReviews]);

  // Функция для проверки необходимости кнопки "Читать далее"
  const needsReadMore = (element) => {
    if (!element || !element.firstChild) return false;
    return element.scrollHeight > element.clientHeight;
  };

  return (
    <div className="reviews-container">
      {initialReviews.length === 0 ? (
        <div className="no-reviews">
          <p>Пока нет отзывов. Будьте первым!</p>
        </div>
      ) : (
        <div className="reviews-grid">
          {initialReviews.map((review, index) => {
            const isExpanded = expandedId === review.id;
            
            return (
              <div key={review.id} className="review-card">
                <div 
                  ref={el => reviewRefs.current[index] = el}
                  className={`review-content ${!isExpanded ? 'truncated' : ''}`}
                  dangerouslySetInnerHTML={sanitizeHtml(review.text)}
                />
                
                {!isExpanded && reviewRefs.current[index] && needsReadMore(reviewRefs.current[index]) && (
                  <button 
                    className="read-more"
                    onClick={() => setExpandedId(review.id)}
                  >
                    Читать далее
                  </button>
                )}
                
                {isExpanded && (
                  <button 
                    className="read-less"
                    onClick={() => setExpandedId(null)}
                  >
                    Свернуть
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
