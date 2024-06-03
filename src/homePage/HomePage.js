import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Header from '../header/header.js';

const sidebarItems = [
    { id: 1, name: 'Home' },
    { id: 2, name: 'Products' },
    { id: 3, name: 'Template' },
    { id: 4, name: 'Another Template' },
];

const HomePage = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`home-page ${darkMode ? 'dark' : 'light'}`}>
            <div className="top-left-container">
                <button
                    onClick={toggleDarkMode}
                    className="toggle-dark-mode"
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            <div className={`sidebar ${darkMode ? 'dark-box' : 'light-box'}`}>
                <br/><br/>
                <ul className="p-4">
                    {sidebarItems.map((item) => (
                        <li key={item.id} className={`py-2 ${darkMode ? 'text-light' : 'text-dark'}`}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={`main-content ${darkMode ? 'dark-box' : 'light-box'}`}>
                <Header darkMode={darkMode} />
                <div className="main-content-inner">
                    <p className={darkMode ? 'text-light' : 'text-dark'}>Click on the button below to login!</p>
                </div>
                <div className="login">
                    <Link to="/login">
                        <button className="login-button">LOGIN</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
