import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import "./registarForm.css";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    registerUser(data);
  };

  const registerUser = (data) => {
    console.log(data);
    fetch("http://127.0.0.1:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((response) => {
        console.log(response);
        if (response.success) {
          alert("Register was a success. Please login to continue.");
          navigate("/login");
        } else {
          alert("Error while creating a new user.");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  };

  return (
    <div className="loginForm">
      <h2>Registro</h2>
      <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label>Username:</label>
          <input className="username" {...register("username", { required: true })} />
          {errors.username && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Password:</label>
          <input className="password" type="password" {...register("password", { required: true })} />
          {errors.password && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Name:</label>
          <input className="nome" {...register("nome", { required: true })} />
          {errors.nome && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Address:</label>
          <input className="morada" {...register("morada", { required: true })} />
          {errors.morada && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Phone Number:</label>
          <input className="telemovel" {...register("telemovel", { required: true })} />
          {errors.telemovel && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Birthdate:</label>
          <input className="dataNascimento" type="date" {...register("dataNascimento", { required: true })} />
          {errors.dataNascimento && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>NIF:</label>
          <input className="nif" {...register("nif", { required: true })} />
          {errors.nif && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>Email:</label>
          <input className="email" type="email" {...register("email", { required: true })} />
          {errors.email && <span className="error-message">This field can't be empty.</span>}
        </div>
        <input className="submit" type="submit" value="Register" />
      </form>
      <div className="login-link">
        <Link to="/login">🡸 Already have a login? Please continue here.</Link>
      </div>
    </div>
  );
};

export default Register;