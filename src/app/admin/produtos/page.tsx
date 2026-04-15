"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  quantityInStock: number;
  category: string
};

export default function Produtos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    quantityInStock: "",
    category: "",
  });

  // =========================
  // LISTAR PRODUTOS
  // =========================
  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data.product);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Confimação de exclusão
  async function handleDelete(id: string) {
    const confirmDelete = confirm("Tem certeza que deseja excluir?");
    if (!confirmDelete) return;

    await api.delete(`/products/${id}`);
    fetchProducts();
  }

  // Loading
  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Produtos</h1>

      {/* Botão para criar usuario */}
      <button
        onClick={() => {
          setEditingProduct(null);
          setForm({
            name: "",
            price: "",
            description: "",
            quantityInStock: "",
            category: "",
          });
          setOpenModal(true);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Novo Produto
      </button>

      {/* TABELA */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Nome</th>
            <th className="p-2">Preço</th>
            <th className="p-2">Estoque</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="text-center border-t">
              <td className="p-2">{product.name}</td>
              <td className="p-2">R$ {product.price}</td>
              <td className="p-2">{product.quantityInStock}</td>
              <td className="p-2">{product.category}</td>

              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setForm({
                      name: product.name,
                      price: String(product.price),
                      description: product.description,
                      quantityInStock: String(product.quantityInStock),
                      category: String(product.category),
                    });
                    setOpenModal(true);
                  }}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h2>

            <input
              placeholder="Nome"
              className="border p-2 w-full mb-2"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Preço"
              className="border p-2 w-full mb-2"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              placeholder="Descrição"
              className="border p-2 w-full mb-2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              placeholder="Estoque"
              className="border p-2 w-full mb-2"
              value={form.quantityInStock}
              onChange={(e) =>
                setForm({ ...form, quantityInStock: e.target.value })
              }
            />

            <input
              placeholder="Categoria"
              className="border p-2 w-full mb-2"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenModal(false)}
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  if (!form.name || !form.price) {
                    alert("Preencha nome e preço");
                    return;
                  }

                  try {
                    const payload = {
                      name: form.name,
                      price: Number(form.price),
                      description: form.description,
                      quantityInStock: Number(form.quantityInStock),
                      category: form.category,
                    };

                    if (editingProduct) {
                      await api.put(
                        `/products/${editingProduct._id}`,
                        payload
                      );
                    } else {
                      await api.post("/products", payload);
                    }

                    setOpenModal(false);
                    setEditingProduct(null);
                    fetchProducts();
                  } catch (err) {
                    console.log(err);
                  }
                }}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}