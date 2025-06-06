import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ProductItem } from '../ProductItem/ProductItem';
import { Spinner } from '../Spinner/Spinner';
import { useProducts } from '../../hooks/useProducts';

export const ProductList = ({ initialProducts = [], totalProducts = 0 }) => {
    const {
        products,
        loading,
        hasMore,
        loadMore,
        error: loadError,
        retryCount
    } = useProducts(initialProducts, totalProducts);

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    useEffect(() => {
        if (inView && !loading && hasMore) {
            loadMore();
        }
    }, [inView, loading, hasMore]);

    return (
        <div className="product-list">
            {products.length > 0 ? (
                products.map(product => (
                    <ProductItem key={product.id} product={product} />
                ))
            ) : (
                !loading && <p className="no-products">Товары не найдены</p>
            )}

            <div ref={ref} className="load-more-trigger">
                {loading && <Spinner />}

                {loadError && (
                    <div className="load-error">
                        <p>{loadError}</p>
                        {retryCount < 3 ? (
                            <p>Попытка {retryCount + 1} из 3...</p>
                        ) : (
                            <button onClick={loadMore}>Повторить попытку</button>
                        )}
                    </div>
                )}

                {!hasMore && products.length > 0 && !loadError && (
                    <p className="end-message">Вы просмотрели все товары</p>
                )}
            </div>
        </div>
    );
};
