import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './produtosG.css';

const EditProductForm = () => {
    const { referencia } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        referencia: '',
        nome: '',
        descricao: '',
        preco: 0,
        categoria: '',
        imagem: '',
    });
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/menu/produtos/${referencia}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    setImagePreview(data.imagem);
                } else {
                    console.error('Erro ao carregar produto:', response.status);
                }
            } catch (error) {
                console.error('Erro ao carregar produto:', error);
            }
        };

        fetchProduct();
    }, [referencia]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setProduct(prevProduct => ({
                    ...prevProduct,
                    imagem: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

            let token = '';
            try {
                const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
                token = parsedCookie.token;
            } catch (error) {
                console.error('Erro ao extrair token do cookie:', error);
            }

            const response = await fetch(`http://127.0.0.1:3001/menu/produtos/${referencia}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `Bearer ${token}`,
                },
                body: JSON.stringify(product),
            });
            if (response.ok) {
                navigate(`/produtos/${referencia}`);
            } else {
                console.error('Erro ao atualizar produto:', response.status);
            }
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

            let token = '';
            try {
                const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
                token = parsedCookie.token;
            } catch (error) {
                console.error('Erro ao extrair token do cookie:', error);
            }
            const response = await fetch(`http://127.0.0.1:3001/menu/produtos/${referencia}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                navigate('/produtos');
            } else {
                console.error('Erro ao excluir produto:', response.status);
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    };

    return (
        <div className="edit-product">
            <h2>Editar produto</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label>
                        Referência:
                        <input type="text" name="referencia" value={product.referencia} readOnly />
                    </label>
                    <label>
                        Nome:
                        <input type="text" name="nome" value={product.nome} onChange={handleChange} required />
                    </label>
                    <label>
                        Descrição:
                        <textarea name="descricao" value={product.descricao} onChange={handleChange} required />
                    </label>
                    <label>
                        Preço:
                        <div className="preco-container">
                            <input className="preco-prod" type="number" name="preco" value={product.preco} onChange={handleChange} required step="0.01" />
                            <span className="currency-symbol">€</span>
                        </div>
                    </label>
                    <label>
                        Categoria:
                        <input type="text" name="categoria" value={product.categoria} onChange={handleChange} required />
                    </label>
                    <div className="button-container">
                        <button type="submit" className="update-button">Atualizar Produto</button>
                        <button type="button" className="delete-button" onClick={handleDelete}>Eliminar Produto</button>
                    </div>
                </form>
                <div className="image-panel">
                    <label>
                        Imagem:
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Imagem do Produto" />
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default EditProductForm;
