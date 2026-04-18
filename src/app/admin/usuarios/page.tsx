"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  profile: string;
};

export default function Usuarios() {
  const [pageError, setPageError] = useState("");   // erros da tabela
  const [modalError, setModalError] = useState(""); // erros do modal
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    pass: "",
    profile: "user",
  });

  // atualiza o status da busca
  const [search, setSearch] = useState("");

  // filtro de usuários
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // paginação de usuarios na tabela
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // botao de páginas
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // busca os usuarios no banco
  async function fetchUsers() {
    try {
      const res = await api.get("/users");
      setUsers(res.data.user);
    } catch (err) {
      setPageError("Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // função para deletar o usuário
  async function handleDelete(id: string, userName: string) {
    try {
      const confirmDelete = confirm(`Tem certeza que deseja excluir o usuário: ${userName}`);
      if (!confirmDelete) return;

      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      if (err.response?.data?.message) {
        alert(err.response.data.message); // mostra resposta da API
      } else {
        alert("Erro ao deletar usuário");
      }
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Usuários</h1>

      {/* criar usuario */}
      <button
        onClick={() => {
          setModalError("");
          setEditingUser(null)
          setForm({
            name: "",
            email: "",
            pass: "",
            profile: "user",
          });
          setOpenModal(true);
        }} className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Novo Usuário
      </button>

      <input
        type="text"
        placeholder="Buscar usuário..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }
        }
        className="border p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Tabela de usuarios */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Nome</th>
            <th className="p-2">Email</th>
            <th className="p-2">Perfil</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="text-center border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.profile}</td>

              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setModalError("");
                    setEditingUser(user);
                    setForm({
                      name: user.name,
                      email: user.email,
                      pass: "",
                      profile: user.profile,
                    });
                    setOpenModal(true);
                  }}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Editar
                </button>

                <button
                  onClick={async () => handleDelete(user._id, user.name)}
                  className="bg-red-500 text-white px-2 py-1 rounded">
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

      {pageError && (
          <p className="text-red-500 mb-2">{pageError}</p>
        )
      }

      {
        openModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
              <h2 className="text-xl mb-4">
                {editingUser ? "Editar Usuário" : "Novo Usuário"}
              </h2>

              {
                modalError && (
                  <p className="text-red-500 mb-2">{modalError}</p>
                )
              }

              <input
                placeholder="Nome"
                className="border p-2 w-full mb-2"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="border p-2 w-full mb-2"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Senha"
                className="border p-2 w-full mb-2"
                value={form.pass}
                onChange={(e) =>
                  setForm({ ...form, pass: e.target.value })
                }
              />

              <select
                className="border p-2 w-full mb-4"
                value={form.profile}
                onChange={(e) =>
                  setForm({ ...form, profile: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex justify-end gap-2">
                <button onClick={() => {
                  setPageError("");
                  setOpenModal(false)
                }
                }
                >
                  Cancelar
                </button>

                <button
                  onClick={async () => {
                    if (!form.name || !form.email) {
                      setModalError("Campos obrigatórios: nome, email");
                      return;
                    }

                    try {
                      if (editingUser) {
                        const payload: any = {
                          name: form.name,
                          email: form.email,
                          profile: form.profile,
                        };

                        if (form.pass) {
                          payload.pass = form.pass;
                        }

                        await api.put(`/users/${editingUser._id}`, payload);
                      } else {
                        if (!form.pass) {
                          setModalError("Campos obrigatórios: nome, email e senha!");
                          return;
                        }
                        await api.post("/users", form);
                      }

                      setOpenModal(false);
                      setEditingUser(null);
                      setPageError("");
                      fetchUsers();

                    } catch (err: any) {
                      if (err.response?.data?.message) {
                        setModalError(err.response.data.message) // mostra resposta da API para email ja cadastrado no sistema
                      } else {
                        setModalError("Erro ao salvar usuário")
                      }
                    }
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}