"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Dashboard() {
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
                console.log("Erro:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <p>Carregando...</p>;

    return (
        <div>
            <h1 className="text-2xl">Dashboard</h1>
            <p>Total de usuários: {users}</p>

            <p>Total de produtos: {products}</p>
        </div>

    );
}