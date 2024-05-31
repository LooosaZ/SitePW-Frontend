import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Header from '../header/header.js';
import "./LoginForm.css";

const LoginForm = () => {
    let navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const login = (data) => {
        fetch("http://127.0.0.1:3001/auth/login", {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((r) => r.json())
            .then((response) => {
                console.log(response);
                if (response.auth) {
                    setLoginSuccess(true);
                    console.log("Login successful");
                } else {
                    alert("Login failed");
                    console.log("Login failed");
                }
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    };

    const onSubmit = (data) => {
        login(data);
    };

    if (loginSuccess) {
        navigate("/players");
    }

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-dark' : 'bg-light'}`}>
            <Header darkMode={darkMode} />
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-4 left-4 p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
            >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className={`box ${darkMode ? 'dark-box' : 'light-box'} shadow-md rounded-lg p-8 max-w-sm w-full relative`}>
                <h2 className={`text-2xl font-bold text-center mb-4 ${darkMode ? 'text-light' : 'text-dark'}`}>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="username" className={`block text-sm font-medium ${darkMode ? 'text-light' : 'text-dark'}`}>
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            {...register('username', { required: true })}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 ${darkMode ? 'dark-input dark:text-dark-input-text' : 'light-input'}`}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-light' : 'text-dark'}`}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', { required: true })}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 ${darkMode ? 'dark-input dark:text-dark-input-text' : 'light-input'}`}
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-md w-full transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
