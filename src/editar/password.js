import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./password.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

      let token = '';
      try {
        const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
        token = parsedCookie.token;
      } catch (error) {
        console.error('Erro ao extrair token do cookie:', error);
      }

      const response = await fetch("http://127.0.0.1:3001/menu/utilizador/me/alterar-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `Bearer ${token}`,
        },
        body: JSON.stringify({
          passwordAntiga: data.currentPassword,
          novaPassword: data.newPassword,
        }),
      });

      setLoading(false);

      if (response.ok) {
        alert("Password alterada com sucesso!");
        // Remover o token do cookie
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Redirecionar para a página de login
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(`Erro ao alterar a password: ${errorData.message}`);
      }
    } catch (error) {
      setLoading(false);
      console.error("Erro ao alterar a Password:", error);
      alert("Erro ao alterar a Password. Verifique sua conexão ou tente novamente mais tarde");
    }
  };

  return (
    <div className="changePassword">
      <h2>Alterar Password</h2>
      <form className="form-edit" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label>Password Atual:</label>
          <input
            className="currentPassword"
            type="password"
            {...register("currentPassword", { required: true })}
          />
          {errors.currentPassword && <span className="error-message">Este campo é obrigatório.</span>}
        </div>
        <div className="field">
          <label>Nova Password:</label>
          <input
            className="newPassword"
            type="password"
            {...register("newPassword", { required: true, minLength: 6 })}
          />
          {errors.newPassword && <span className="error-message">Este campo é obrigatório e deve ter pelo menos 6 caracteres.</span>}
        </div>
        <div className="field">
          <label>Confirmar Nova Password:</label>
          <input
            className="confirmNewPassword"
            type="password"
            {...register("confirmNewPassword", {
              required: true,
              validate: value => value === getValues("newPassword") || "As Passwords não coincidem",
            })}
          />
          {errors.confirmNewPassword && <span className="error-message">{errors.confirmNewPassword.message || "Este campo é obrigatório."}</span>}
        </div>
        <input className="submit" type="submit" value="Alterar Password" disabled={loading} />
      </form>
    </div>
  );
};

export default ChangePassword;
