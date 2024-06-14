import './App.css';
import { Route, Routes } from "react-router-dom";
import LoginForm from './login/LoginForm';
import Registar from "./registar/registarForm";
import Header from "./header/header";
import Produtos from "./produto/Produtos";
import Produto from "./produto/Produto";
import Recover from "./recover/recoverForm";
import Reset from "./recover/resetForm";
import User from "./users/ProfilePage";

function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/registar" element={<Registar />} />
                    <Route path="/recover" element={<Recover />} />
                    <Route path="/reset" element={<Reset />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/produtos/:referencia" element={<Produto />} />
                    <Route path="/me" element={<User />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
