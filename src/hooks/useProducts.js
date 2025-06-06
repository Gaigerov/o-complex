import {useState, useEffect, useCallback} from 'react';

export const useProducts = (initialProducts = [], initialTotal = 0) => {
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalProducts, setTotalProducts] = useState(initialTotal);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    useEffect(() => {
        setProducts(initialProducts);
        setTotalProducts(initialTotal);
        setPage(1);
        setHasMore(initialProducts.length < initialTotal);
        setError(null);
        setRetryCount(0);
    }, [initialProducts, initialTotal]);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        setError(null);

        try {
            const nextPage = page + 1;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            // Используем локальный прокси
            const response = await fetch(
                `/api/proxy?page=${nextPage}&page_size=6`,
                {signal: controller.signal}
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            // Проверка структуры ответа
            if (!responseData ||
                !Array.isArray(responseData.items) ||
                typeof responseData.total !== 'number') {
                throw new Error('Некорректный формат ответа сервера');
            }

            const items = responseData.items || [];
            const newTotal = responseData.total;

            setTotalProducts(newTotal);

            setProducts(prev => {
                const newProducts = [...prev, ...items];
                const hasMoreItems = newProducts.length < newTotal;
                setHasMore(hasMoreItems);
                return newProducts;
            });

            setPage(nextPage);
            setRetryCount(0);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);

            let errorMessage = 'Неизвестная ошибка';
            if (error.name === 'AbortError') {
                errorMessage = 'Превышено время ожидания сервера';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Ошибка сети. Проверьте подключение к интернету';
            } else {
                errorMessage = error.message || 'Ошибка загрузки товаров';
            }

            setError(errorMessage);

            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => setHasMore(true), 3000);
            } else {
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, retryCount]);

    return {
        products,
        loading,
        hasMore,
        loadMore,
        error,
        retryCount,
        totalProducts
    };
};
