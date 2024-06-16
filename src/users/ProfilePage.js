import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

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

        const response = await fetch("http://127.0.0.1:3001/menu/utilizador/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

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

  const handleDeleteUser = async (userId) => {
    try {
      const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

      let token = '';
      try {
        const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
        token = parsedCookie.token;
      } catch (error) {
        console.error('Erro ao extrair token do cookie:', error);
      }

      const response = await fetch(`http://127.0.0.1:3001/menu/utilizador/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        alert("Utilizador deletado com sucesso!");
      } else {
        console.error(`Erro ao deletar utilizador: ${response.status}`);
        alert("Erro ao deletar utilizador.");
      }
    } catch (error) {
      console.error("Erro ao deletar utilizador:", error);
      alert("Erro ao deletar utilizador. Verifique sua conexão ou tente novamente mais tarde.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

      let token = '';
      try {
        const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
        token = parsedCookie.token;
      } catch (error) {
        console.error('Erro ao extrair token do cookie:', error);
      }

      const response = await fetch(`http://127.0.0.1:3001/menu/produto/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
        alert("Produto deletado com sucesso!");
      } else {
        console.error(`Erro ao deletar produto: ${response.status}`);
        alert("Erro ao deletar produto.");
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto. Verifique sua conexão ou tente novamente mais tarde.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!profileImage) return;

    try {
      const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

      let token = '';
      try {
        const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
        token = parsedCookie.token;
      } catch (error) {
        console.error('Erro ao extrair token do cookie:', error);
      }

      const response = await fetch("http://127.0.0.1:3001/menu/utilizador/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ fotoPerfil: profileImage }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        alert("Foto de perfil atualizada com sucesso!");
        window.location.reload();
      } else {
        console.error(`Erro ao atualizar a foto de perfil: ${response.status}`);
        alert("Erro ao atualizar a foto de perfil.");
      }
    } catch (error) {
      console.error("Erro ao atualizar a foto de perfil:", error);
      alert("Erro ao atualizar a foto de perfil. Verifique sua conexão ou tente novamente mais tarde.");
    }
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="userProfile">
      <h2>Perfil do Utilizador</h2>
      <div className="userImage">
        <img src={user.fotoPerfil} alt='Foto do Utilizador' />
      </div>
      <input type="file" accept="image/*" className="imageButton" onChange={handleImageChange} />
      <button className="uploadButton" onClick={handleUploadImage}>Atualizar Foto de Perfil</button>
      <div className="userField">
        <strong>Utilizador:</strong> <span>{user.username}</span>
      </div>
      <div className="userField">
        <strong>Nome completo:</strong> <span>{user.nome}</span>
      </div>
      <div className="userField">
        <strong>Morada:</strong> <span>{user.morada}</span>
      </div>
      <div className="userField">
        <strong>Telemóvel:</strong> <span>{user.telemovel}</span>
      </div>
      <div className="userField">
        <strong>Data de Nascimento:</strong> <span>{new Date(user.dataNascimento).toLocaleDateString()}</span>
      </div>
      <div className="userField">
        <strong>NIF:</strong> <span>{user.nif}</span>
      </div>
      <div className="userField">
        <strong>Email:</strong> <span>{user.email}</span>
      </div>
      <div className="userField">
        <strong>Tipo de conta:</strong> <span>{user.role.nome}</span>
      </div>
      <Link to={{ pathname: "/me/editar", state: { userData: user } }} className="edit-profile-button">
        Editar perfil
      </Link>
      <Link to={{ pathname: "/me/editar/password", state: { userData: user } }} className="password-button">
        Alterar Password
      </Link>

      {user.role && user.role.nome === 'administrador' && (
        <>
          <div className="adminUserTable">
            <h3>Utilizadores</h3>
            <table>
              <thead>
                <tr>
                  <th>Nome de Utilizador</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.nome}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user._id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="adminProductTable">
            <h3>Produtos</h3>
            <table>
              <thead>
                <tr>
                  <th>Nome do Produto</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>{product.nome}</td>
                    <td>{product.descricao}</td>
                    <td>{product.preco}</td>
                    <td>
                      <button onClick={() => handleDeleteProduct(product._id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
