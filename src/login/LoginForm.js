import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import "./LoginForm.css";

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [loginSuccess, setLoginSuccess] = useState(false);

    const onSubmit = (data) => {
        login(data);
    };

    const login = (data) => {
        console.log(data);
        fetch("http://127.0.0.1:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        })
            .then((r) => r.json())
            .then((response) => {
                console.log(response);
                if (response.auth) {
                    setLoginSuccess(true);
                } else {
                    alert("Tentativa de login fracassada");
                }
            })
            .catch((error) => {
                console.error("Erro:", error);
            });
    };

    useEffect(() => {
        if (loginSuccess) {
            navigate("/produtos");
        }
    }, [loginSuccess, navigate]);

    return (
        <div className="loginForm">
            <h2>Login</h2>
            <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <label>Username:</label>
                    <input className="username" {...register("username")} />
                </div>
                <div className="field">
                    <label>Password:</label>
                    <input className="password" type="password" {...register("password")} />
                </div>
                <input className="submit" type="submit" />
            </form>
            <div className="forgot-link">
                <Link to="/recover">Redefinir palavra-passe</Link>
            </div>
            <div className="register-link">
                <Link to="/registar">Registar novo utilizador</Link>
            </div>
            <div className="return-link">
                <Link to="/produtos">🡸 Voltar para a página de produtos</Link>
            </div>
        </div>
    );
};

export default Login;