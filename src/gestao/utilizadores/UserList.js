import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);


    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));
    
            let token = '';
            try {
              const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
              token = parsedCookie.token;
            } catch (error) {
              console.error('Erro ao extrair token do cookie:', error);
            }
    
            const response = await fetch("http://127.0.0.1:3001/menu/utilizadores/", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": `Bearer ${token}`,
              },
              credentials: "include",
            });
    
            if (response.ok) {
              const userData = await response.json();
              setUsers(userData);
              console.log(userData)

    
              if (userData.role && userData.role.nome === 'administrador') {
                fetchProducts(token);
              }
            } else {
              console.error(`Erro ao carregar os dados do utilizador: ${response.status}`);
            }
          } catch (error) {
            console.error("Erro ao carregar os dados do utilizador:", error);
          }
        };
    
        const fetchProducts = async (token) => {
          try {
            const response = await fetch("http://127.0.0.1:3001/menu/produtos", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": `Bearer ${token}`,
              },
              credentials: "include",
            });
    
            if (response.ok) {
              const productsData = await response.json();
              setProducts(productsData);
            } else {
              console.error(`Erro ao carregar os dados dos produtos: ${response.status}`);
            }
          } catch (error) {
            console.error("Erro ao carregar os dados dos produtos:", error);
          }
        };
    
        fetchUserData();
      }, []);
    return (
        <div className="user-list">
            <h2>Manage Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.username}>
                        <Link to={`/admin/users/${user.username}`}>Clique para editar o utilizador: "{user.username}"</Link>
                    </li>
                ))}
            </ul>
        </div>
        
    );
};


export default UserList;
