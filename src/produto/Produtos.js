import React, { useState, useEffect, useCallback } from 'react';
import './Produtos.css';
import ReactSlider from 'react-slider';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';

const ProductCard = ({ nome, preco, imagem, stock, referencia }) => (
    <Link to={`/produtos/${referencia}`} className="product-link">
        <div className="product-layer">
            <img src={imagem} alt="Sem pré-visualização" className="image" />
            <h3 className="title-product">{nome}</h3>
            <p className="price-product">{preco.toFixed(2)} €</p>
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
                <p className="no-stock-info">Sem informações de stock disponíveis</p>
            )}
        </div>
    </Link>
);

const ProductGrid = ({ products }) => (
    <div className="container">
        <div className="grid">
            {products.map((product, index) => (
                <ProductCard key={index} {...product} />
            ))}
        </div>
    </div>
);

const SidebarSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="sidebar-section">
            <div className="sidebar-section-header" onClick={() => setIsOpen(!isOpen)}>
                <h3>{title}</h3>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && <div className="sidebar-section-content">{children}</div>}
        </div>
    );
};

const ProductComponent = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortBy, setSortBy] = useState('nome');
    const [sortOrder, setSortOrder] = useState('asc');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchProducts = useCallback(
        debounce(async (query, minPrice, maxPrice, sort, order) => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/menu/produtos?searchField=nome&searchValue=${query}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sort}&sortOrder=${order}`);
                const data = await response.json();
                setProducts(data);
                console.log('Produtos recebidos:', data);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        }, 500),
        []
    );

    useEffect(() => {
        fetchProducts(searchQuery, priceRange[0], priceRange[1], sortBy, sortOrder);
    }, [searchQuery, priceRange, sortBy, sortOrder, fetchProducts]);

    const handleSortChange = (e) => {
        const value = e.target.value;
        if (value === 'az' || value === 'za') {
            setSortBy('nome');
            setSortOrder(value === 'az' ? 'asc' : 'desc');
        } else if (value === 'lowPrice' || value === 'highPrice') {
            setSortBy('preco');
            setSortOrder(value === 'lowPrice' ? 'asc' : 'desc');
        }
    };

    const handleCategoryChange = (category) => {
        const lowerCaseCategory = category.toLowerCase();
        setSelectedCategories(prev => {
            if (prev.includes(lowerCaseCategory)) {
                return prev.filter(cat => cat !== lowerCaseCategory);
            } else {
                return [...prev, lowerCaseCategory];
            }
        });
    };

    const categories = [...new Set(products.map(product => product.categoria.toLowerCase()))].sort().map(category => category.toUpperCase());

    const filteredProducts = products.filter(product => {
        if (selectedCategories.length === 0) {
            return true;
        }
        return selectedCategories.includes(product.categoria.toLowerCase());
    });

    return (
        <div className="background">
            <div className="sidebar">
                <SidebarSection title="Nome">
                    <div className="name">
                        <input
                            type="text"
                            placeholder="Pesquisar produto"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="search-products"
                        />
                    </div>
                </SidebarSection>
                <SidebarSection title="Ordenação">
                    <div className="dropdown">
                        <select value={sortBy === 'nome' ? (sortOrder === 'asc' ? 'az' : 'za') : (sortOrder === 'asc' ? 'lowPrice' : 'highPrice')} onChange={handleSortChange}>
                            <option value="az">Ordernar A-Z</option>
                            <option value="za">Ordenar Z-A</option>
                            <option value="lowPrice">Ordenar preço mais baixo</option>
                            <option value="highPrice">Ordenar preço mais alto</option>
                        </select>
                    </div>
                </SidebarSection>
                <SidebarSection title="Categorias">
                    <div className="subcategory">
                        {categories.map((category, index) => (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    value={category}
                                    checked={selectedCategories.includes(category.toLowerCase())}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </SidebarSection>
                <SidebarSection title="Preço">
                    <div className="price-range">
                        <ReactSlider
                            className="horizontal-slider"
                            thumbClassName="thumb"
                            trackClassName="track"
                            defaultValue={[0, 1000]}
                            min={0}
                            max={1000}
                            step={1}
                            onChange={(value) => setPriceRange(value)}
                            value={priceRange}
                        />
                        <div className="price-labels">
                            <span>{priceRange[0]} €</span> -&nbsp;
                            <span>{priceRange[1]} €</span>
                        </div>
                    </div>
                </SidebarSection>
            </div>
            {filteredProducts.length === 0 ? (
                <p className="no-products">Não há produtos com esses filtros</p>
            ) : (
                <ProductGrid products={filteredProducts} />
            )}
        </div>
    );
};

export default ProductComponent;
