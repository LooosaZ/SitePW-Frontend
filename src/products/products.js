import React, { useState } from 'react';
import './products.css';
import Header from "../header/header";

const productData = [
    {
        name: 'A',
        description: 'Description of Product 1',
        imgSrc: 'https://placehold.co/150',
    },
    {
        name: 'B',
        description: 'Description of Product 2',
        imgSrc: 'https://placehold.co/150',
    },
    {
        name: 'C',
        description: 'Description of Product 3',
        imgSrc: 'https://placehold.co/150',
    },
    {
        name: 'D',
        description: 'Description of Product 4',
        imgSrc: 'https://placehold.co/150',
    },
];

const ProductCard = ({ name, description, imgSrc, darkMode }) => (
    <div className={`product-card ${darkMode ? 'dark-box' : 'light-box'}`}>
        <img src={imgSrc} alt={name} className="mb-4" />
        <h3 className={`text-lg font-semibold mb-2 primary-text`}>{name}</h3>
        <p className={`text-sm ${darkMode ? 'secondary-text-dark' : 'secondary-text-light'}`}>{description}</p>
    </div>
);

const ProductGrid = ({ darkMode, products }) => (
    <div className="container mx-auto p-4 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
                <ProductCard key={index} {...product} darkMode={darkMode} />
            ))}
        </div>
    </div>
);

const ProductComponent = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = productData.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <Header darkMode={darkMode} />
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="fixed top-4 left-4 p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
            >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="container mx-auto p-4">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
            </div>
            <ProductGrid darkMode={darkMode} products={filteredProducts} />
        </div>
    );
};

export default ProductComponent;
