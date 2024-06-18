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
import Editar from "./editar/editar";
import Password from "./editar/password";
import GestaoProduto from "./gestao/produtos/produtosG";
import AdicionarProduto from "./gestao/produtos/produtosA";
import UserList from "./gestao/utilizadores/UserList";
import UserEdit from "./gestao/utilizadores/UserEdit";
import UserProfile from "./gestao/utilizadores/UserProfile";
import ErrorPage from "./ErrorPage/ErrorPage";
import Carrinho from "./carrinho/Carrinho";
import Stock from "./gestao/stocks/Stocks";
import Compra from "./carrinho/Carrinho"


function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <Routes>
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/produtos/:referencia" element={<Produto />} />
                    <Route path="/registar" element={<Registar />} />
                    <Route path="/recover" element={<Recover />} />
                    <Route path="/reset" element={<Reset />} />
                    <Route path="/me" element={<User />} />
                    <Route path="/me/editar" element={<Editar />} />
                    <Route path="/me/editar/password" element={<Password />} />
                    <Route path="/admin/produto/:referencia" element={<GestaoProduto />} />
                    <Route path="/admin/produtos/adicionar" element={<AdicionarProduto />} />
                    <Route path="/admin/users" element={<UserList />} />
                    <Route path="/admin/users/:username" element={<UserProfile />} />
                    <Route path="/admin/users/edit/:username" element={<UserEdit />} />
                    <Route path="/carrinho" element={<Carrinho />} />
                    <Route path="/admin/stock/adicionar/:referencia" element={<Stock />} />
                    <Route path="/confirmar" element={<Compra />} />
                    <Route path="/*" element={<ErrorPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
