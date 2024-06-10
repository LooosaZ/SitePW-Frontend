import React from 'react';
import './HomePage.css';

const sharedButtonClasses = "text-white px-4 py-2 rounded-lg transition-colors button";

const HomePage = () => {
    return (
        <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to LuzaServices</h1>
            <p className="text-lg mb-8">Explore our services and products</p>
            <a href="/products" className={`button bg-red-500 ${sharedButtonClasses} mb-4 hover:bg-red-600`}>Products</a>
            <a href="/login" className={`button bg-red-500 ${sharedButtonClasses} hover:bg-red-600`}>Login</a>
        </div>
    );
};

export default HomePage;
