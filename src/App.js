import './App.css';
import React from "react";
import HomePage from "./homePage/HomePage";
import Products from "./products/products";
import LoginForm from "./login/LoginForm";
import { Route, Routes } from "react-router-dom";

function App() {

    return (
        <div>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginForm />}/>
                    <Route path="/products" element={<Products/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;