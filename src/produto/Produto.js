import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Produto.css';

const ProductDetails = () => {
    const { referencia } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [token, setToken] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cartExists, setCartExists] = useState(false); // State para verificar se há um carrinho existente

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

    const addToCart = async () => {
        try {
            // Verificar se existe um carrinho existente para o usuário
            const cartResponse = await fetch(`http://127.0.0.1:3001/menu/venda/me`, {
                method: 'GET',
                headers: {
                    'x-access-token': `Bearer ${token}`
                },
                credentials: 'include'
            });
    
            if (cartResponse.ok) {
                const cartData = await cartResponse.json();
                console.log('Carrinho do Utilizador:', cartData);
    
                // Verificar se há um carrinho com estado "no carrinho"
                const existingCart = cartData.find(venda => venda.estado === 'no carrinho');
    
                if (existingCart) {
                    const nrVenda = existingCart.nrVenda;
                    console.log(nrVenda);
                    // Já existe um carrinho com estado "no carrinho", atualiza a venda existente
                    const response = await fetch(`http://127.0.0.1:3001/menu/venda/me`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': `Bearer ${token}`
                        },
                        body: JSON.stringify({ produtos: [{ refProduto: referencia, quantity }], nrVenda }), // Exemplo: atualizar a quantidade do produto no carrinho
                        credentials: 'include'
                    });
                    const data = await response.json();
                    console.log('Produto atualizado no carrinho:', data);
                } else {
                    // Não existe um carrinho com estado "no carrinho", cria um novo carrinho
                    const response = await fetch(`http://127.0.0.1:3001/menu/venda/me`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': `Bearer ${token}`
                        },
                        body: JSON.stringify({ referencia, quantity }), // Exemplo: adicionar a quantidade especificada do produto ao carrinho
                        credentials: 'include'
                    });
                    const data = await response.json();
                    console.log('Produto adicionado ao carrinho:', data);
                }
    
            } else {
                console.error('Erro ao verificar o carrinho do usuário');
            }
        } catch (err) {
            console.error('Erro ao adicionar produto ao carrinho:', err);
            // Lógica adicional, como exibir mensagem de erro ao usuário
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
                    <p className="note"> Vendido por: <strong>JR Bricolage</strong></p>
                    <p><strong>Referência: {productDetails.referencia}</strong></p>
                    <p><strong>Nome:</strong> {productDetails.nome}</p>
                    <p><strong>Descrição:</strong> {productDetails.descricao}</p>
                    <p><strong>Categoria:</strong> {productDetails.categoria}</p>
                    {stock ? (
                        stock.quantidade > 0 ? (
                            stock.quantidade < 50 ? (
                                <p className="low-stock-info">🟡 Low stock ({stock.quantidade})</p>
                            ) : (
                                <p className="stock-info">🟢 In stock ({stock.quantidade})</p>
                            )
                        ) : (
                            <p className="no-stock-info">🔴 No stock</p>
                        )
                    ) : (
                        <p className="no-stock-info">Sem informação de stock disponível</p>
                    )}
                    <div className="quantity-container">
                        <p><strong>Quantity:</strong></p>
                        <div className="qtd-container">
                            <input className="qtd-prod" type="number" name="qtd" required step="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                        </div>
                        {token && (
                            <button className={`favorite-toggle ${isFavorite ? 'favorite' : ''}`} onClick={handleFavoriteToggle}>
                                {isFavorite ? '★' : '☆'}
                            </button>
                        )}
                    </div>
                    <div className="container">
                        <button className="add-to-cart" onClick={addToCart}>ADICIONAR AO CARRINHO</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;