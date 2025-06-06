import React, {useState} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Компоненты
import {Reviews} from '../../Reviews/Reviews';
import {Header} from '../../Header/Header';
import {PhoneForm} from '../../PhoneForm/PhoneForm';
import {Popup} from '../../Popup/Popup';

// Динамическая загрузка
const ProductList = dynamic(() => import('../../ProductList/ProductList').then(mod => mod.ProductList), {
    loading: () => <div className="loader"><div className="loader-spinner"></div></div>,
    ssr: false
});

export const HomePage = ({initialReviews, initialProducts, totalProducts, error}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const handleOrderSuccess = (message) => {
        setPopupMessage(message);
        setIsPopupOpen(true);
    };

    return (
        <>
            <Head>
                <title>Интернет-магазин | Главная</title>
                <meta name="description" content="Лучшие товары по выгодным ценам" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <section className="header-section">
                    <div className="section-title">тестовое задание</div>
                    <div className="container">
                        <Reviews initialReviews={initialReviews} />
                    </div>
                </section>

                <section className="section">
                    <div className="order-form">
                        <Header products={initialProducts || []} />
                        <PhoneForm onSuccess={handleOrderSuccess} />
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        {error ? (
                            <div className="error-block">
                                <p>{error}</p>
                                <button onClick={() => window.location.reload()}>
                                    Попробовать снова
                                </button>
                            </div>
                        ) : (
                            <ProductList
                                initialProducts={initialProducts}
                                totalProducts={totalProducts}
                            />
                        )}
                    </div>
                </section>
            </main>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                message={popupMessage}
            />
        </>
    );
};
