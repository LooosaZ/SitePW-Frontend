import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Produto.css';

const ProductDetails = () => {
    const { referencia } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                // Fetch product details
                const productResponse = await fetch(`http://127.0.0.1:3001/menu/produtos/${referencia}`, {
                    credentials: 'include'
                });
                const productData = await productResponse.json();
                console.log('Detalhes do Produto:', productData);
                setProductDetails(productData);

                // Decodificar o cookie para obter o token
                const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));
                let token = '';
                try {
                    const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
                    token = parsedCookie.token;
                    setToken(token); // Set token state if present
                } catch (error) {
                    console.error('Erro ao extrair token do cookie:', error);
                }

                if (token) {
                    // Fetch user favorites if token is present
                    const favoritesResponse = await fetch(`http://127.0.0.1:3001/menu/utilizador/favoritos`, {
                        method: 'GET',
                        headers: {
                            'x-access-token': `Bearer ${token}`
                        },
                        credentials: 'include'
                    });
                    const favoritesData = await favoritesResponse.json();
                    console.log('Favoritos do Utilizador:', favoritesData);

                    // Verificar se a referência do produto está nos favoritos
                    const isFavoriteProduct = Array.isArray(favoritesData) && favoritesData.includes(referencia);
                    setIsFavorite(isFavoriteProduct);
                }
            } catch (err) {
                console.error('Erro ao buscar detalhes do produto:', err);
            }
        };

        fetchProductDetails();
    }, [referencia]);

    const handleFavoriteToggle = async () => {
        if (!token) return; // Do nothing if token is not present

        const newIsFavorite = !isFavorite;
        setIsFavorite(newIsFavorite);

        try {
            // Atualizar favoritos
            const response = await fetch(`http://127.0.0.1:3001/menu/utilizador/favoritos`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `Bearer ${token}`
                },
                body: JSON.stringify({ referencia, add: newIsFavorite }),
                credentials: 'include'
            });

            const data = await response.json();
            console.log('Atualização dos favoritos:', data);
        } catch (err) {
            console.error('Erro ao atualizar favoritos:', err);
        }
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
                    <p className="note"> Vendido por: <strong>Lusa Phones</strong></p>
                    <p><strong>Referência: {productDetails.referencia}</strong></p>
                    <p><strong>Nome:</strong> {productDetails.nome}</p>
                    <p><strong>Descrição:</strong> {productDetails.descricao}</p>
                    <p><strong>Categoria:</strong> {productDetails.categoria}</p>
                    {stock ? (
                        stock.quantidade > 0 ? (
                            stock.quantidade < 5 ? (
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
                        {token && (
                            <button className={`favorite-toggle ${isFavorite ? 'favorite' : ''}`} onClick={handleFavoriteToggle}>
                                {isFavorite ? '★' : '☆'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
