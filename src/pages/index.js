import {HomePage} from '../components/pages/HomePage/HomePage';
import {fetchReviews, fetchProducts} from '../utils/api';
import {sanitizeHtml} from '../utils/sanitizeHtml';

export async function getServerSideProps() {
    try {
        const [reviews, productsData] = await Promise.all([
            fetchReviews(),
            fetchProducts(1, 6)
        ]);

        // Очищаем отзывы перед передачей в компонент
        const safeReviews = reviews.map(review => ({
            ...review,
            text: sanitizeHtml(review.text).__html
        }));

        return {
            props: {
                initialReviews: safeReviews,
                initialProducts: productsData.items,
                totalProducts: productsData.total
            }
        };
    } catch (error) {
        console.error('SSR Error:', error);
        return {
            props: {
                initialReviews: [],
                initialProducts: [],
                totalProducts: 0,
                error: 'Не удалось загрузить данные'
            }
        };
    }
}

export default HomePage;
