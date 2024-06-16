import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "./resetForm.css";

const ResetPassword = () => {
  const { register, handleSubmit } = useForm();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = (data) => {
    fetch("http://127.0.0.1:3001/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao redefinir a senha");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.success) {
          setResetSuccess(true);
        } else {
          setErrorMessage(data.error || "Erro ao redefinir a senha. Verifique os dados inseridos.");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        setErrorMessage("Erro ao redefinir a senha. Verifique os dados inseridos.");
      });
  };

  return (
    <div className="resetPasswordForm">
      <h2>Redefinir Palavra-passe</h2>
      {resetSuccess ? (
        <div className="success-message">
          <p>Senha redefinida com sucesso.</p>
          <Link to="/login">Voltar para a página de login</Link>
        </div>
      ) : (
        <form className="form-reset-password" onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label>Email:</label>
            <input className="email" {...register("email")} />
          </div>
          <div className="field">
            <label>Token:</label>
            <input className="token" {...register("token")} />
          </div>
          <div className="field">
            <label>Nova Palavra-passe:</label>
            <input className="new-password" type="password" {...register("novaPassword")} />
          </div>
          <input className="submit" type="submit" value="Enviar" />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      )}
      <div className="return-link">
        <Link to="/login">🡸 Voltar para a página de login</Link>
      </div>
    </div>
  );
};

export default ResetPassword;
