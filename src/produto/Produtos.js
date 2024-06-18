import React, { useState, useEffect, useCallback } from 'react';
import './Produtos.css';
import ReactSlider from 'react-slider';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash.debounce';

const ProductCard = ({ nome, preco, imagem, stock, referencia, isAdmin }) => {
    const productLink = isAdmin ? `/admin/produto/${referencia}` : `/produtos/${referencia}`;

    return (
        <Link to={productLink} className="product-link">
            <div className="product-layer">
                <img src={imagem} alt="Sem pré-visualização" className="image" />
                <h3 className="title-product">{nome}</h3>
                <p className="price-product">{preco.toFixed(2)} €</p>
                {stock ? (
                    stock.quantidade > 0 ? (
                        stock.quantidade < 5 ? (
                            <p className="low-stock-info">🟡 Low stock ({stock.quantidade})</p>
                        ) : (
                            <p className="stock-info">🟢 In stock ({stock.quantidade})</p>
                        )
                    ) : (
                        <p className="no-stock-info">🔴 No stock</p>
                    )
                ) : (
                    <p className="no-stock-info">No stock information avaliable</p>
                )}
            </div>
        </Link>
    );
};

const ProductGrid = ({ products, isAdmin }) => (
    <div className="container">
        <div className="grid">
            {products.map((product, index) => (
                <ProductCard key={index} {...product} isAdmin={isAdmin} />
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
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [sortBy, setSortBy] = useState('nome');
    const [sortOrder, setSortOrder] = useState('asc');
    const [stockStatus, setStockStatus] = useState('all');
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [tokenAvailable, setTokenAvailable] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    
     // eslint-disable-next-line
     const fetchProducts = useCallback(
        debounce(async (query, minPrice, maxPrice, sort, order, stockStatus, page, favoritesOnly) => {
            try {
                setIsFetching(true);
                const response = await fetch(`http://127.0.0.1:3001/menu/produtos?searchField=nome&searchValue=${query}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sort}&sortOrder=${order}&stockStatus=${stockStatus}&page=${page}`);
                const data = await response.json();
                setProducts((prevProducts) => (page === 1 ? data.products : [...prevProducts, ...data.products]));
                setTotalPages(data.totalPages);
                console.log('received products:', data);
                setIsFetching(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setIsFetching(false);
            }
        }, 500),
        []
    );


    const fetchFavorites = useCallback(async () => {
        try {
            const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

            let token = '';
            try {
                const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
                token = parsedCookie.token;
            } catch (error) {
                console.error('Error while extracting cookie:', error);
            }

            const response = await fetch('http://127.0.0.1:3001/menu/utilizador/filtrarfavoritos', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `Bearer ${token}`,
                },
                credentials: "include",
            });
            const data = await response.json();
            setFavorites(data.map(product => product.referencia));
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    }, []);

    useEffect(() => {
        fetchProducts(searchQuery, priceRange[0], priceRange[1], sortBy, sortOrder, stockStatus, page);
    }, [searchQuery, priceRange, sortBy, sortOrder, stockStatus, page, fetchProducts]);

    useEffect(() => {
        const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));
        const tokenExists = cookieValue.trim() !== '';
        setTokenAvailable(tokenExists);

        if (tokenExists) {
            try {
                const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
                const token = parsedCookie.token;
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

                const { role } = JSON.parse(jsonPayload);
                console.log(role);
                 // eslint-disable-next-line
                if (role == 'administrador') { setIsAdmin(true) };
            } catch (error) {
                console.error('Error while analizing token:', error);
            }
        } else {
            setFavorites([]);
            setFavoritesOnly(false);
        }
    }, []);

    useEffect(() => {
        if (favoritesOnly && tokenAvailable) {
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [favoritesOnly, fetchFavorites, tokenAvailable]);

    const resetProducts = () => {
        setProducts([]);
        setPage(1);
    };
    
    useEffect(() => {
        resetProducts();
    }, [searchQuery, priceRange, sortBy, sortOrder, stockStatus, favoritesOnly]);

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

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight && page < totalPages && !isFetching) {
            setPage(prevPage => prevPage + 1);
        }
    };
    
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
         // eslint-disable-next-line
    }, [page, totalPages, isFetching]);

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

    const handleStockStatusChange = (status) => {
        setStockStatus(status);
    };

    const handleFavoritesChange = () => {
        if (tokenAvailable) {
            setFavoritesOnly(!favoritesOnly);
        }
    };

    const categories = [...new Set(products.map(product => product.categoria.toLowerCase()))].sort().map(category => category.toUpperCase());

    const filteredProducts = products.filter(product => {
        if (selectedCategories.length === 0) {
            return true;
        }
        return selectedCategories.includes(product.categoria.toLowerCase());
         // eslint-disable-next-line
    }).filter(product => {
        if (stockStatus === 'all') {
            return true;
        } else if (stockStatus === 'inStock') {
            return product.stock && product.stock.quantidade > 0;
        } else if (stockStatus === 'outOfStock') {
            return !product.stock || product.stock.quantidade <= 0;
        }
    }).filter(product => {
        if (!favoritesOnly || !tokenAvailable) {
            return true;
        }
        return favorites.includes(product.referencia);
    });

    return (
        <div className="background">
            <div className="sidebar">
                {isAdmin && (
                    <SidebarSection title="Admin section">
                        <Link to="/admin/produtos/adicionar" className="add-product-link">
                            <button className="add-product-button">
                                Add new product
                            </button>
                        </Link>
                        <br></br><br></br>
                    </SidebarSection>
                )}
                <SidebarSection title="Name">
                    <div className="name">
                        <input
                            type="text"
                            placeholder="Search Product"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="search-products"
                        />
                    </div>
                </SidebarSection>
                <SidebarSection title="Filter">
                    <div className="dropdown">
                        <select value={sortBy === 'nome' ? (sortOrder === 'asc' ? 'az' : 'za') : (sortOrder === 'asc' ? 'lowPrice' : 'highPrice')} onChange={handleSortChange}>
                            <option value="az">A-Z</option>
                            <option value="za">Z-A</option>
                            <option value="lowPrice">Low-High</option>
                            <option value="highPrice">High-Low</option>
                        </select>
                    </div>
                </SidebarSection>
                <SidebarSection title="Price">
                    <div className="price-range">
                        <ReactSlider
                            className="horizontal-slider"
                            thumbClassName="thumb"
                            trackClassName="track"
                            defaultValue={[0, 5000]}
                            min={0}
                            max={5000}
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
                <SidebarSection title="Stock">
                    <div className="stock-status">
                        <label>
                            <input
                                type="radio"
                                value="all"
                                checked={stockStatus === 'all'}
                                onChange={() => handleStockStatusChange('all')}
                            />
                            All
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="inStock"
                                checked={stockStatus === 'inStock'}
                                onChange={() => handleStockStatusChange('inStock')}
                            />
                            In stock
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="outOfStock"
                                checked={stockStatus === 'outOfStock'}
                                onChange={() => handleStockStatusChange('outOfStock')}
                            />
                            No stock
                        </label>
                    </div>
                </SidebarSection>
                {tokenAvailable && (
                    <SidebarSection title="Favorites">
                        <div className="favorites-filter">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={favoritesOnly}
                                    onChange={handleFavoritesChange}
                                />
                                Show only favorites
                            </label>
                        </div>
                    </SidebarSection>
                )}
                <SidebarSection title="Categories">
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
            </div>
            {filteredProducts.length === 0 ? (
                <p className="no-products">No avaliable products for set filter</p>
            ) : (
                <InfiniteScroll
                    dataLength={filteredProducts.length}
                    next={() => setPage(page)}
                    hasMore={page < totalPages}
                    loader={ <h4>Loading...</h4>}
                    scrollThreshold={0.5}
                >
                    <ProductGrid products={filteredProducts} isAdmin={isAdmin} />
                    <br></br><br></br>
                    {page >= totalPages && (
                <p style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
                    <br></br><br></br>
                    <b>No more products avaliable for listing.</b>
                </p>
            )}
                </InfiniteScroll>
            )}
        </div>
    );
};

export default ProductComponent;
