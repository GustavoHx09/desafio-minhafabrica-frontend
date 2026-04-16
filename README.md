📦 README - FRONTEND (README.md)
# 🚀 Frontend - Desafio Minha Fábrica

Este é o frontend da aplicação desenvolvido com Next.js, TypeScript, React e Tailwind.

---

## 🛠️ Tecnologias utilizadas

- Next.js
- React
- Axios
- Tailwind CSS
- TypeScript

---

## 📥 Instalação


```bash
Clone o repositório:

git clone https://github.com/seu-repo/frontend.git


Entre na pasta:

cd frontend


Instale as dependências:

npm install


⚙️ Configuração do .env

Crie um arquivo .env.local na raiz do projeto:

NEXT_PUBLIC_API_URL=http://localhost:3001

👉 Essa variável define a URL da API (backend)


▶️ Rodando o projeto

npm run dev

O frontend estará disponível em:

http://localhost:3000


⚠️ IMPORTANTE (PORTAS)

Por padrão:

Frontend → 3000
Backend → 3001

👉 Se quiser rodar ambos no mesmo PC, mantenha portas diferentes


Se precisar mudar a porta do frontend:

npm run dev -- -p 3002


🔐 Autenticação

O sistema usa token JWT armazenado no localStorage
Algumas páginas são protegidas (ex: /admin)
Sem token → redireciona para login


🌐 Integração com Backend

Todas as requisições são feitas via Axios:

baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v1"


📌 Funcionalidades
Login
CRUD de usuários
CRUD de produtos
Dashboard
Filtro de busca
Paginação


🧪 Testando o sistema

Para testar corretamente:

Suba o backend
Configure o .env.local
Faça login
Utilize as funcionalidades


📦 Build para produção
npm run build
npm start


❗ Problemas comuns

❌ Erro de CORS
Verifique se o backend permite o domínio do frontend

❌ API não responde
Verifique se o backend está rodando

❌ URL undefined
Verifique o .env.local


📄 Licença

Este projeto é apenas para fins de estudo!