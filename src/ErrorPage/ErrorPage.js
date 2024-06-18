import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';
import NotFoundImage from "./404.gif";
import Background from "./BRAZIL.jpg"

const NotFound = () => {
    return (
        <div className="not-found" style={{backgroundImage: `url(${Background})`}}>
            <h1>Error 404</h1>
            <p>You got lost and ended up finding the legendary brazilian dancing dog</p>
            <p>Return to the start page below.</p>
            <div className="not-found-content">
                <img src={NotFoundImage} alt="Page not found" className="not-found-image" />
                <Link to="/produtos" className="home-button">Start Page</Link>
            </div>
        </div>
    );
};

export default NotFound;
