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
  const [pageError, setPageError] = useState("");   // erros da tabela
  const [modalError, setModalError] = useState(""); // erros do modal

  const [products, setProducts] = useState<Product[]>([]);

  // define o estado do modal (editando/salvando)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // abre o modal
  const [openModal, setOpenModal] = useState(false);

  // mostra enquanto carrega os dados
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    quantityInStock: "",
    category: "",
  });

  // atualiza o status da busca
  const [search, setSearch] = useState("");

  // filtro de usuários
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  // paginação de usuarios na tabela
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const indexOfLastUser = currentPage * productsPerPage;
  const indexOfFirstUser = indexOfLastUser - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstUser, indexOfLastUser);

  // botao de páginas
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Busca os produtos no banco
  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data.product);
    } catch (err: any) {
      setPageError("Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Confimação de exclusão de produto
  async function handleDelete(id: string, productName: string) {
    try {
      const confirmDelete = confirm(`Tem certeza que deseja excluir o produto ${productName}?`);
      if (!confirmDelete) return;

      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      if (err.response?.data?.message) {
        alert(err.response.data.message); // mostra resposta da API
      } else {
        alert("Erro ao deletar produto");
      }
    }
  }

  // Loading
  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Produtos</h1>

      {/* Botão para criar usuario */}
      <button
        onClick={() => {
          setModalError("");
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

      {/* Campo de busca/filtro */}
      <input
        type="text"
        placeholder="Buscar produto..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }
        }
        className="border p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Tabela */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Nome</th>
            <th className="p-2">Descrição</th>
            <th className="p-2">Preço</th>
            <th className="p-2">Estoque</th>
            <th className="p-2">Categoria</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>

        <tbody>
          {currentProducts.map((product) => (
            <tr key={product._id} className="text-center border-t">
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.description}</td>
              <td className="p-2">R$ {product.price}</td>
              <td className="p-2">{product.quantityInStock}</td>
              <td className="p-2">{product.category}</td>

              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setModalError("");
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
                  onClick={() => handleDelete(product._id, product.name)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 gap-2">

        {/* /////////////////
        Botões das páginas 
        //////////////////*/}

        {/* Voltar */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Voltar
        </button>

        {/* Paginas */}
        {Array.from({ length: totalPages }, (_, index) => (

          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
              }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Avançar */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Próximo
        </button>
      </div>
      {
        pageError && (
          <p className="text-red-500 mb-2">{pageError}</p>
        )
      }
      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl mb-4">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h2>

            {modalError && (
              <p className="text-red-500 mb-2">{modalError}</p>
            )}

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
                onClick={() => {
                  setPageError("");
                  setOpenModal(false)
                }
                }
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  if (!form.name || !form.price || !form.quantityInStock || !form.category) {
                    setModalError("Campos obrigatórios: nome, preço, estoque e categoria!");
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
                    setPageError("");
                    fetchProducts();
                  } catch (err: any) {
                    if (err.response?.data?.message) {
                      setModalError(err.response.data.message); // salva e depois exibe a resposta da API
                    } else {
                      setModalError("Erro ao salvar produto");
                    }
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