import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Stocks.css";

const AddStock = () => {
    const { referencia } = useParams();
    const [reference, setReference] = useState(referencia || "");
    const [movementType, setMovementType] = useState("ENTRADA");
    const [quantity, setQuantity] = useState(0);

    const handleReferenceChange = (e) => setReference(e.target.value);
    const handleMovementTypeChange = (e) => setMovementType(e.target.value);
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);  // Converte para número inteiro base 10
        if (!isNaN(value) && value >= 0) {  // Verifica se o valor é um número válido e não negativo
            setQuantity(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));
            let token = '';
            try {
                const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
                token = parsedCookie.token;
            } catch (error) {
                console.error('Erro ao extrair token do cookie:', error);
            }

            if (!token) {
                console.error('Token não encontrado');
                return;
            }

            // Verificar se o stock já existe
            const checkStockResponse = await fetch(`http://127.0.0.1:3001/menu/stocks/${reference}`, {
                method: 'GET',
                headers: {
                    'x-access-token': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            });

            if (checkStockResponse.ok) {
                // Se o stock existe, atualize-o
                const existingStock = await checkStockResponse.json();
                const updatedQuantity = movementType === "ENTRADA" ? existingStock.quantidade + quantity : existingStock.quantidade - quantity;

                const updateResponse = await fetch(`http://127.0.0.1:3001/menu/stocks/${reference}`, {
                    method: 'PUT',
                    headers: {
                        'x-access-token': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: updatedQuantity }),
                });
               
                console.log("Status da requisição PUT:", updateResponse.status);
                console.log("Quantidade:", quantity);
                console.log("Movimento:", movementType);
                console.log("Stock existente:", existingStock.quantidade);
                console.log("Quantidade atualizada:", updatedQuantity);

                if (updateResponse.ok) {
                    console.log("Stock atualizado com sucesso.");
                    alert(`Successfully updated Stock quantity.\n\n Updated quantity in database: ${updatedQuantity}`)
                } else {
                    console.error("Erro ao atualizar o stock:", updateResponse.statusText);
                    alert(`You are trying to remove more items than what you have.\n\n" + "Current quantity in database: ${existingStock.quantidade}`)
                }
            } else if (checkStockResponse.status === 404) {
                // Se o stock não existe, crie-o
                const createResponse = await fetch('http://127.0.0.1:3001/menu/stocks', {
                    method: 'POST',
                    headers: {
                        'x-access-token': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        refProduto: reference,
                        quantidade: quantity,
                        movimento: movementType,
                    }),
                });

                if (createResponse.ok) {
                    console.log("Stock criado com sucesso.");
                } else {
                    console.error("Erro ao criar o stock.");
                }
            } else {
                console.error("Erro ao verificar o stock.");
            }
        } catch (error) {
            console.error("Erro ao adicionar stock:", error);
        }
    };

    return (
        <div className="add-stock">
            <h2>Add Stock</h2>
            <form onSubmit={handleSubmit} className="form-add-stock">
                <div className="field">
                    <label htmlFor="reference">Reference:</label>
                    <input
                        type="text"
                        id="reference"
                        value={reference}
                        onChange={handleReferenceChange}
                        className="input-text"
                        readOnly
                    />
                </div>
                <div className="field">
                    <label htmlFor="movementType">Movement type:</label>
                    <select
                        id="movementType"
                        value={movementType}
                        onChange={handleMovementTypeChange}
                        className="input-select"
                    >
                        <option value="ENTRADA">ENTRADA</option>
                        <option value="SAIDA">SAIDA</option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="0"
                        className="input-number"
                    />
                </div>
                <button type="submit" className="submit-button">
                    ADD
                </button>
            </form>
        </div>
    );
};

export default AddStock;
