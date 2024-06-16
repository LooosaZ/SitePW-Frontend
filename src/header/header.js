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
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            setLoggedIn(true);
            fetchUserRole(token);
        }
    }, []);

    const fetchUserRole = async (token) => {
        try {
            const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

            let token = '';
            try {
                const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
                token = parsedCookie.token;
            } catch (error) {
                console.error('Erro ao extrair token do cookie:', error);
            }

            const response = await fetch("http://127.0.0.1:3001/menu/utilizador/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (response.ok) {
                const userData = await response.json();
                setUserRole(userData.role.nome);
            } else {
                console.error(`Erro ao carregar os dados do utilizador: ${response.status}`);
            }
        } catch (error) {
            console.error("Erro ao carregar os dados do utilizador:", error);
        }
    };

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUserRole('');
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log('Logout efetuado. Redirecionando para login...');
    };

    if (location.pathname === '/login' || location.pathname === '/registar' || location.pathname === '/recover' || location.pathname === '/reset') {
        return null;
    }

    return (
        <header className="header">
            <h1>Lusa Phones</h1>
            <nav>
                <ul className="prod">
                    <li><NavLink to="/produtos">Produtos</NavLink></li>
                </ul>
                <ul className="perfil">
                    {loggedIn ? (
                        <>
                            {userRole === 'administrador' && (
                                <>
                                    <li><NavLink to="/admin/utilizadores">Gestão de Utilizadores</NavLink></li>
                                    <li><NavLink to="/admin/produtos">Gestão de Produtos</NavLink></li>
                                    <li><NavLink to="/admin/stock">Gestão de Stock</NavLink></li>
                                    <li><NavLink to="/admin/vendas">Gestão de Vendas</NavLink></li>
                                </>
                            )}
                            {userRole === 'utilizador' && (
                                <>
                                    <li><NavLink to="/carrinho">Carrinho</NavLink></li>
                                    <li><NavLink to="/me">Minha conta</NavLink></li>
                                </>
                            )}
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
