import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import "./ProfilePage.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const { username } = useParams();

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

        const response = await fetch(`http://127.0.0.1:3001/menu/utilizadores/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `Bearer ${token}`,
          },
          credentials: "include",
        });

        console.log(username);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          console.log(userData);

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
  }, [username]);

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
        alert("Successfully deleted user.");
      } else {
        console.error(`Erro ao deletar utilizador: ${response.status}`);
        alert("Error while trying to delete user.");
      }
    } catch (error) {
      console.error("Erro ao deletar utilizador:", error);
      alert("Error while trying to delete user. Verify your connection or try again later.");
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
        alert(`Succesfully deleted the product ${productId}`);
      } else {
        console.error(`Erro ao deletar produto: ${response.status}`);
        alert("Error while trying to delete product");
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Error while trying to delete product. Verify your connection or try again later.");
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

      const response = await fetch(`http://127.0.0.1:3001/menu/utilizador/${user.username}/profile-picture`, {
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
        alert("Successfully updated your profile picture!");
        window.location.reload();
      } else {
        console.error(`Erro ao atualizar a foto de perfil: ${response.status}`);
        alert("Error while trying to update your profile picture.");
      }
    } catch (error) {
      console.error("Erro ao atualizar a foto de perfil:", error);
      alert("Error while trying to update your profile picture. Verify your connection or try again later.");
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="userProfile">
      <h2>{user.username}</h2>
      <div className="userImage">
        <img src={user.fotoPerfil} alt='Profile Picture' />
      </div>
      <input type="file" accept="image/*" className="imageButton" onChange={handleImageChange} />
      <button className="uploadButton" onClick={handleUploadImage}>Update Profile Picture</button>
      <div className="userField">
        <strong>Full Name:</strong> <span>{user.nome}</span>
      </div>
      <div className="userField">
        <strong>Address:</strong> <span>{user.morada}</span>
      </div>
      <div className="userField">
        <strong>Phone Number:</strong> <span>{user.telemovel}</span>
      </div>
      <div className="userField">
        <strong>Birthdate:</strong> <span>{new Date(user.dataNascimento).toLocaleDateString()}</span>
      </div>
      <div className="userField">
        <strong>NIF:</strong> <span>{user.nif}</span>
      </div>
      <div className="userField">
        <strong>Email:</strong> <span>{user.email}</span>
      </div>
      <div className="userField">
        <strong>Account type:</strong> <span>{user.role.nome}</span>
      </div>
      <Link to={{ pathname: `/admin/users/edit/${username}`, state: { userData: user } }} className="edit-profile-button">
        Edit Profile
      </Link>
    </div>
  );
};

export default UserProfile;
