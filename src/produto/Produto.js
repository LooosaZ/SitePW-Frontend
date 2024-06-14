import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Produto.css';

const ProductDetails = () => {
    const { referencia } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/menu/produtos/${referencia}`, {
                    credentials: 'include' // Include cookies in the request
                });
                const data = await response.json();
                console.log('Detalhes do Produto:', data);
                setProductDetails(data);
                setIsFavorite(data.isFavorite);
            } catch (err) {
                console.error('Erro ao buscar detalhes do produto:', err);
            }
        };

        fetchProductDetails();
    }, [referencia]);

    const handleFavoriteToggle = async () => {
        setIsFavorite(prevState => !prevState);

        // Obtém o cookie do token
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});
        const token = cookies.token;

        console.log("Token do cookie:", token);

        if (!token) {
            console.error('Token não encontrado');
            return;
        }

        const updateFavorites = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/menu/utilizador/favoritos`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Adiciona o token no header Authorization
                    },
                    body: JSON.stringify({ referencia, add: !isFavorite }),
                    credentials: 'include' // Include cookies in the request
                });
                const data = await response.json();
                if (response.status === 401) {
                    console.error('Token inválido ou expirado');
                } else {
                    console.log('Atualização dos favoritos:', data);
                }
            } catch (err) {
                console.error('Erro ao atualizar favoritos:', err);
            }
        };

        updateFavorites();
    };

    if (!productDetails) {
        return <div>Carregando...</div>;
    }

    const { stock } = productDetails;

    return (
        <div className="product-card">
            <h1>{productDetails.nome.toUpperCase()}</h1>
            <div className="product-details">
                {productDetails.imagem && (
                    <div className="image-container">
                        <img src={productDetails.imagem} alt={productDetails.nome} className="product-image" />
                    </div>
                )}
                <div className="product-info">
                    <h2>{productDetails.preco.toFixed(2)} €</h2>
                    <p className="note"> Vendido por: <strong>LusaPhones</strong></p>
                    <p><strong>Referência: {productDetails.referencia}</strong></p>
                    <p><strong>Nome:</strong> {productDetails.nome}</p>
                    <p><strong>Descrição:</strong> {productDetails.descricao}</p>
                    <p><strong>Categoria:</strong> {productDetails.categoria}</p>
                    {stock ? (
                        stock.quantidade > 0 ? (
                            stock.quantidade < 500 ? (
                                <p className="low-stock-info">🟡 Quase a esgotar</p>
                            ) : (
                                <p className="stock-info">🟢 Em stock</p>
                            )
                        ) : (
                            <p className="no-stock-info">🔴 Não tem stock</p>
                        )
                    ) : (
                        <p className="no-stock-info">Sem informação de stock disponível</p>
                    )}
                    <div className="button-container">
                        <button className="add-to-cart">ADICIONAR AO CARRINHO</button>
                        <button className={`favorite-toggle ${isFavorite ? 'favorite' : ''}`} onClick={handleFavoriteToggle}>
                            {isFavorite ? '★' : '☆'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
