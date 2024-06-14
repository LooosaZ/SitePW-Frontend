import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import "./header.css";

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const Header = () => {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            setLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        setLoggedIn(false);
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log('Logout efetuado. Redirecionando para login...');
    };

    if (location.pathname === '/login' || location.pathname === '/registar' || location.pathname === '/recover') {
        return null;
    }

    return (
        <header className="header">
            <h1>LusaPhones</h1>
            <nav>
                <ul className="prod">
                    <li><NavLink to="/produtos">Produtos</NavLink></li>
                </ul>
                <ul className="perfil">
                    <li><NavLink to="/carrinho">Carrinho</NavLink></li>
                    {loggedIn ? (
                        <>
                            <li><NavLink to="/me">Minha conta</NavLink></li>
                            <li><NavLink to="/login" onClick={handleLogout}>Logout</NavLink></li>
                        </>
                    ) : (
                        <li><NavLink to="/login" onClick={handleLogin}>Login</NavLink></li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
