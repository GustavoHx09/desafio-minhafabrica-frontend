"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [messageError, setMessageError] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleLogin(e: any) {
        e.preventDefault();

        setLoading(true); // começa autenticação
        setMessageError("");

        try {
            const response = await api.post("/auth/login", {
                email,
                pass,
            });

            localStorage.setItem("token", response.data.token);

            router.push("/admin/dashboard");
        } catch (err: any) {
            if (err.response?.data?.message) {
                setMessageError(err.response.data.message);
            } else {
                setMessageError("Erro no login");
            }
        } finally {
            setLoading(false); // termina a autencitação
        }
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow w-80">
                <h1 className="text-xl mb-4">Login</h1>

                {messageError && (
                    <p className="text-red-500 mb-2">{messageError}</p>
                )}

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

                <button
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 w-full disabled:opacity-50"
                >
                    {loading && <p className="text-sm text-gray-500 mb-2">Autenticando...</p>}
                    Login
                </button>
            </form>
        </div>
    );
}