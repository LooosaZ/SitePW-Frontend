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
        alert("Successfully changed passwords. Please login again.");
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
      alert("Errow while trying to update password. Verify your connection or try again later.");
    }
  };

  return (
    <div className="changePassword">
      <h2>Change Password</h2>
      <form className="form-edit" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label>Current Password:</label>
          <input
            className="currentPassword"
            type="password"
            {...register("currentPassword", { required: true })}
          />
          {errors.currentPassword && <span className="error-message">This field can't be empty.</span>}
        </div>
        <div className="field">
          <label>New Password:</label>
          <input
            className="newPassword"
            type="password"
            {...register("newPassword", { required: true, minLength: 6 })}
          />
          {errors.newPassword && <span className="error-message">This field can't be empty and must contain at least 6 characters.</span>}
        </div>
        <div className="field">
          <label>Confirm New Password:</label>
          <input
            className="confirmNewPassword"
            type="password"
            {...register("confirmNewPassword", {
              required: true,
              validate: value => value === getValues("newPassword") || "As Passwords não coincidem",
            })}
          />
          {errors.confirmNewPassword && <span className="error-message">{errors.confirmNewPassword.message || "This field can't be empty."}</span>}
        </div>
        <input className="submit" type="submit" value="Confirm" disabled={loading} />
      </form>
    </div>
  );
};

export default ChangePassword;
