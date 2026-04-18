"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Dashboard() {
    const [errorMessage, setErrorMessage] = useState("");
    const [users, setUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState(0);

    useEffect(() => {
        async function fetchData() {

            try {
                const [usersRes, productsRes] = await Promise.all([
                    api.get("/users"),
                    api.get("/products"),
                ]);

                setUsers(usersRes.data.user.length);
                setProducts(productsRes.data.product.length);

            } catch (err) {
                setErrorMessage("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            {
                errorMessage && (
                    <p className="text-red-500 mb-2">{errorMessage}</p>
                )
            }

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card usuários */}
                <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col">
                    <span className="text-gray-800">Usuários</span>
                    <span className="text-3xl font-bold mt-2">{users}</span>
                </div>

                {/* Card produtos */}
                <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col">
                    <span className="text-gray-800">Produtos</span>
                    <span className="text-3xl font-bold mt-2">{products}</span>
                </div>

            </div>
        </div>
    );
}