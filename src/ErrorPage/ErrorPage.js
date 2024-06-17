import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';
import NotFoundImage from "./Image1.jpg";

const NotFound = () => {
    return (
        <div className="not-found">
            <h1>Error 404</h1>
            <p>Curva errada parceiro, clica logo ou passa tudo</p>
            <p>O tiro só come se não sair</p>
            <div className="not-found-content">
                <img src={NotFoundImage} alt="Page not found" className="not-found-image" />
                <Link to="/produtos" className="home-button">Página inicial</Link>
            </div>
        </div>
    );
};

export default NotFound;
