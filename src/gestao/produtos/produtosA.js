import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import "./produtosA.css";

const AdicionarProduto = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            // Decodificar o cookie para obter o token
            const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));
            let token = '';
            try {
                const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
                token = parsedCookie.token;
            } catch (error) {
                console.error('Erro ao extrair token do cookie:', error);
            }

            const response = await fetch("http://127.0.0.1:3001/menu/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert("Successfully added a new product!");
                navigate("/produtos");
            } else {
                const errorData = await response.json();
                alert(`Errow while creating new product: ${errorData.message}`);
            }
        } catch (err) {
            console.error("Erro ao adicionar produto:", err);
            alert("Error while adding new product. Verify your connection or try again later.");
        }
    };

    return (
        <div className="adicionarProdutoForm">
            <h2>Add New Product</h2>
            <form className="form-adicionar-produto" onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <label>Reference:</label>
                    <input className="referencia" {...register("referencia", { required: true })} />
                    {errors.referencia && <span className="error-message">This field can't be empty.</span>}
                </div>
                <div className="field">
                    <label>Product Name:</label>
                    <input className="nomeProduto" {...register("nome", { required: true })} />
                    {errors.nomeProduto && <span className="error-message">This field can't be empty.</span>}
                </div>
                <div className="field">
                    <label>Description:</label>
                    <textarea className="descricao" {...register("descricao", { required: true })} />
                    {errors.descricao && <span className="error-message">This field can't be empty.</span>}
                </div>
                <div className="field">
                    <label>Price:</label>
                    <input className="preco" type="number" step="0.01" {...register("preco", { required: true, min: 0 })} />
                    {errors.preco && errors.preco.type === "required" && <span className="error-message">This field can't be empty.</span>}
                    {errors.preco && errors.preco.type === "min" && <span className="error-message">Price MUST be a value greater than or equals 0 (zero)</span>}
                </div>
                <div className="field">
                    <label>Category:</label>
                    <input className="categoria" {...register("categoria", { required: true })} />
                    {errors.categoria && <span className="error-message">This field can't be empty.</span>}
                </div>
                <input className="submit" type="submit" value="Confirm" />
            </form>
            <div className="login-link">
                <Link to="/produtos">🡸 Take me back to the products page</Link>
            </div>
        </div>
    );
};

export default AdicionarProduto;
