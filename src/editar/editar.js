import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./editar.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

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
          setUserData(userData);
          setValue("username", userData.username || "");
          setValue("nome", userData.nome || "");
          setValue("morada", userData.morada || "");
          setValue("telemovel", userData.telemovel || "");
          const formattedDate = userData.dataNascimento ? new Date(userData.dataNascimento).toISOString().substr(0, 10) : "";
          setValue("dataNascimento", formattedDate);
          setValue("nif", userData.nif || "");
          setValue("email", userData.email || "");
          setLoading(false);
        } else {
          console.error(`Erro ao carregar os dados do utilizador: ${response.status}`);
          alert("Error while trying to load user data. Try again later.");
        }
      } catch (error) {
        console.error("Erro ao carregar os dados do utilizador:", error);
        alert("Error while trying to load user data. Verify your connection or try again later.");
      }
    };

    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data) => { 
    try {
      const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

      let token = '';
      try {
        const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
        token = parsedCookie.token;
      } catch (error) {
        console.error('Erro ao extrair token do cookie:', error);
      }

      const modifiedFields = {};
      if (data.username !== userData.username) {
        modifiedFields.username = data.username;
      }
      if (data.nome !== userData.nome) {
        modifiedFields.nome = data.nome;
      }
      if (data.morada !== userData.morada) {
        modifiedFields.morada = data.morada;
      }
      if (data.telemovel !== userData.telemovel) {
        modifiedFields.telemovel = data.telemovel;
      }
      if (data.dataNascimento !== userData.dataNascimento) {
        modifiedFields.dataNascimento = data.dataNascimento;
      }
      if (data.nif !== userData.nif) {
        modifiedFields.nif = data.nif;
      }
      if (data.email !== userData.email) {
        modifiedFields.email = data.email;
      }

      const response = await fetch("http://127.0.0.1:3001/menu/utilizador/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `Bearer ${token}`,
        },
        body: JSON.stringify(modifiedFields),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.logout) {
          // Username was changed, logout the user
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          alert("Username was changed. Please login again.");
          navigate("/login");
        } else {
          alert("Successfully updated user data.");
          navigate("/me");
        }
      } else {
        const errorData = await response.json();
        alert(`Error while updating user data: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao editar utilizador:", error);
      alert("Error while updating user data. Verify your connection or try again later.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="editProfile">
      <h2>Edit Profile</h2>
      <form className="form-edit" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label>Username:</label>
          <input className="username" {...register("username", { required: true })} />
          {errors.username && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Name:</label>
          <input className="username" {...register("nome", { required: true })} />
          {errors.nome && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Address:</label>
          <input className="username" {...register("morada", { required: true })} />
          {errors.morada && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Phone Number:</label>
          <input className="username" {...register("telemovel", { required: true })} />
          {errors.telemovel && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Birthdate:</label>
          <input className="username" type="date" {...register("dataNascimento", { required: true })} />
          {errors.dataNascimento && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>NIF:</label>
          <input className="username" {...register("nif", { required: true })} />
          {errors.nif && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Email:</label>
          <input className="username" type="email" {...register("email", { required: true })} />
          {errors.email && <span className="error-message">This field can't be empty.</span>}
        </div>
        <input className="submit" type="submit" value="Update" />
      </form>
    </div>
  );
};

export default EditProfile;
