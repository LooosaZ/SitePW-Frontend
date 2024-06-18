import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Carrinho.css';

const CartGrid = ({ cartProducts, onRemoveProduct }) => (
  <div className="cart-grid">
    {cartProducts.map((product, index) => (
      <ProductCard
        key={index}
        nome={product.nome}
        preco={product.preco}
        imagem={product.imagem}
        quantidade={product.quantidade}
        onRemove={() => onRemoveProduct(index)}
      />
    ))}
  </div>
);

const ProductCard = ({ nome, preco, imagem, quantidade, onRemove }) => {
  const totalProduto = (preco * quantidade).toFixed(2);
  return (
    <div className="cart-card">
      <img src={imagem} alt={nome} className="cart-image" />
      <div className="cart-details">
        <h3 className="cart-title">{nome}</h3>
        <p className="cart-price">Preço p/ unidade: {preco.toFixed(2)} €</p>
        <p className="cart-total">Total: {totalProduto} €</p>
      </div>
      <p className="cart-quantity">{quantidade} x</p>
      <button className="remove-button" onClick={onRemove}>X</button>
    </div>
  );
};

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));
        console.log('Cookie value:', cookieValue);

        let token = '';
        try {
          const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
          token = parsedCookie.token;
          console.log('Token extraído:', token);
        } catch (error) {
          console.error('Erro ao extrair token do cookie:', error);
        }
        const response = await axios.get('http://127.0.0.1:3001/menu/venda/me', {
          headers: {
            'x-access-token': `Bearer ${token}`
          },
          credentials: 'include'
        });

        const validProducts = response.data[0]?.produtos.filter(product => product.nome && product.preco && product.quantidade)
          .map(product => ({ ...product, nrVenda: response.data[0].nrVenda }));

        setCartProducts(validProducts || []);
      } catch (error) {
        console.error('Erro ao buscar produtos do carrinho:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, []);

  // Frontend request adjustment
  const removeProduct = async (index) => {
    const productId = cartProducts[index].ref;
    const nrVenda = cartProducts[index].nrVenda;

    if (!productId || !nrVenda) {
      console.error('ProductId or NrVenda not found:', { productId, nrVenda });
      return;
    }

    try {
      const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));
      const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
      const token = parsedCookie.token;

      const response = await axios.delete('http://127.0.0.1:3001/menu/venda/produto', {
        headers: {
          'x-access-token': `Bearer ${token}`
        },
        data: {
          nrVenda,
          productId,
        }
      });

      if (response.status === 200) {
        // Atualizando o estado localmente
        setCartProducts(cartProducts.filter((_, i) => i !== index));
      } else {
        console.error('Erro ao remover produto do carrinho:', response);
      }
    } catch (error) {
      console.error('Erro ao remover produto do carrinho:', error);
    }
  };


  const calcularTotal = () => {
    if (!cartProducts || cartProducts.length === 0) return '0.00';

    let total = 0;
    cartProducts.forEach((product) => {
      total += product.preco * product.quantidade;
    });
    return total.toFixed(2);
  };

  const handleFinalizar = async () => {
    const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));
    const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
    const token = parsedCookie.token;

    try {
      const response = await axios.put('http://127.0.0.1:3001/menu/venda/finalizar', {
        produtos: cartProducts
      }, {
        headers: {
          'x-access-token': `Bearer ${token}`
        },
        data: {
          produtos: cartProducts
        }
      });

      if (response.status === 200) {
        alert('Compra finalizada com sucesso!');

        setCartProducts([]);
      } else {
        alert('Erro ao finalizar a compra.');
      }
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cart-page">
      <h2>Products in cart</h2>
      <CartGrid cartProducts={cartProducts} onRemoveProduct={removeProduct} />
      <div className="total-container">
        <div>
          <div className="total-label">TOTAL:</div>
          <div className="total-label-price">{calcularTotal()} €</div>
        </div>
        <button className="continue-button" onClick={handleFinalizar}>Purchase</button>
      </div>
    </div>
  );
};

export default CartPage;
