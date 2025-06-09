# 🚀 Projeto Backend - API E-commerce

API RESTful completa para sistema de e-commerce com autenticação JWT, CRUD de produtos, categorias e usuários.

## 📋 Pré-requisitos

- Node.js 18+
- npm 9+
- MySQL 8+ ou SQLite (para desenvolvimento)
- Git

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/JannioFSantos/projectbackend.git
cd projetobackend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

## 🏗️ Configuração do Banco de Dados

1. Execute as migrações:
```bash
npx sequelize-cli db:migrate
```

2. (Opcional) Popule com dados de teste:
```bash
npx sequelize-cli db:seed:all
```

## ▶️ Execução

### Modo Desenvolvimento (com hot-reload)
```bash
npm run dev
```

### Modo Produção
```bash
npm start
```

### Testes
```bash
npm test          # Executa todos os testes
npm run test:watch # Executa em modo watch
```

## 📚 Documentação Swagger

A API possui documentação interativa via Swagger UI:

1. Inicie o servidor:
```bash
npm run dev
```

2. Acesse no navegador:
```
http://localhost:3000/api-docs
```

### Como usar:

1. **Autenticação**:
   - Acesse o endpoint `/user/token`
   - Clique em "Try it out"
   - Insira credenciais válidas (ex: admin@test.com / test123)
   - Copie o token retornado

2. **Autorização**:
   - Clique no botão "Authorize" no topo
   - Cole o token no formato: `Bearer [SEU_TOKEN]`

3. **Testando Endpoints**:
   - Selecione qualquer endpoint
   - Clique em "Try it out"
   - Preencha os parâmetros necessários
   - Execute e veja os resultados

## 🧪 Testes

A suíte de testes inclui:

- Testes de modelo (User, Product, Category)
- Testes de controller (User, Product, Category)
- Testes de integração

Para executar testes específicos:
```bash
npm test tests/userController.test.js
```

## 🏛️ Estrutura do Projeto

```
projetobackend/
├── src/
│   ├── config/       # Configurações (banco, swagger)
│   ├── controllers/  # Lógica dos endpoints
│   ├── middleware/   # Middlewares (autenticação)
│   ├── migrations/   # Migrações do banco
│   ├── models/       # Modelos Sequelize
│   ├── routes/       # Definição de rotas
│   └── services/     # Lógica de negócio
├── tests/            # Testes automatizados
├── server.js         # Ponto de entrada
└── .env              # Variáveis de ambiente
```


