import React from 'react';
import { Link } from 'react-router-dom';
import './compra.css';

const Sucesso = () => {
    const randomString = Math.floor(Math.random() * 10**10).toString().padStart(10, '0');

    return (
        <div className="success">
            <h1 className='tit'>Compra realizada com sucesso!</h1>
            <p>O estado da sua encomenda <strong>#{randomString}</strong> foi alterado para <strong>"Em processamento"</strong>.</p>
            <p>Caso pretenda algum esclarecimento adicional, contacte por favor os nossos serviços.</p>
            <br></br><br></br><br></br><br></br>
            <p><strong>Obrigado pela sua compra!</strong></p>
            <p>Com os melhores cumprimentos, <strong>JR BRICOLAGE</strong></p>
        </div>
    );
};

export default Sucesso;