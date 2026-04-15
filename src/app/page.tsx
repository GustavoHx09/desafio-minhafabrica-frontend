"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const router = useRouter();

    async function handleLogin(e: any) {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                pass,
            });

            localStorage.setItem("token", response.data.token);

            router.push("/admin/dashboard");
        } catch (err) {
            alert("Erro no login");
        }
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow">
                <h1 className="text-xl mb-4">Login</h1>

                <input
                    className="border p-2 w-full mb-2"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="border p-2 w-full mb-2"
                    type="password"
                    placeholder="Senha"
                    onChange={(e) => setPass(e.target.value)}
                />

                <button className="bg-blue-500 text-white p-2 w-full">
                    Entrar
                </button>
            </form>
        </div>
    );
}