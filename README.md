# Projeto Backend API

API RESTful para gerenciamento de produtos, categorias e usuários.

## Pré-requisitos

- Node.js 16+
- MySQL 8+
- npm/yarn

## Instalação

1. Clone o repositório
```bash
git clone [https://github.com/JannioFSantos/projectbackend]
cd projetobackend
```

2. Instale as dependências
```bash
npm install
```

3. Configure o banco de dados
- Crie um arquivo `.env` baseado no `.env.example`
- Preencha as credenciais do banco de dados

4. Execute as migrações
```bash
npx sequelize-cli db:migrate
```

## Executando o projeto

Modo desenvolvimento (com hot reload):
```bash
npm run dev
```

Modo produção:
```bash
npm start
```

## Testes

Executar todos os testes:
```bash
npm test
```

Executar testes com watch mode:
```bash
npm run test:watch
```

## Documentação da API (Swagger)

A API está documentada com Swagger UI. Para acessar a documentação interativa:

1. Inicie o servidor:
```bash
npm run dev
```

2. Acesse no navegador:
```
http://localhost:3000/api-docs
```

A documentação inclui:
- Todos os endpoints disponíveis
- Parâmetros esperados para cada rota
- Exemplos de requisições e respostas
- Possibilidade de testar as chamadas diretamente da interface

Para adicionar documentação a novos endpoints, edite os comentários JSDoc nos arquivos de rotas seguindo o padrão OpenAPI 3.0.

Exemplo de documentação para um endpoint:
```javascript
/**
 * @swagger
 * /v1/user:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
```

### Endpoints Principais

#### Autenticação
- `POST /v1/user/token` - Gera token JWT
- `POST /v1/user` - Cria novo usuário

#### Produtos
- `GET /v1/product/search` - Lista produtos com filtros
- `POST /v1/product` - Cria novo produto
- `GET /v1/product/:id` - Obtém produto por ID
- `PUT /v1/product/:id` - Atualiza produto
- `DELETE /v1/product/:id` - Remove produto

#### Categorias
- `GET /v1/category/search` - Lista categorias
- `POST /v1/category` - Cria nova categoria
- `GET /v1/category/:id` - Obtém categoria por ID
- `PUT /v1/category/:id` - Atualiza categoria
- `DELETE /v1/category/:id` - Remove categoria

## Testando o CRUD

1. Primeiro obtenha um token JWT:
```bash
curl -X POST http://localhost:3000/v1/user/token \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test123"}'
```

2. Use o token para acessar os endpoints:
```bash
# Criar produto
curl -X POST http://localhost:3000/v1/product \
  -H "Authorization: Bearer [SEU_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste",
    "slug": "produto-teste",
    "price": 100.50,
    "price_with_discount": 90.50,
    "description": "Descrição do produto"
  }'

# Listar produtos
curl -X GET http://localhost:3000/v1/product/search \
  -H "Authorization: Bearer [SEU_TOKEN]"
```

## Variáveis de Ambiente

| Variável          | Descrição                          | Exemplo               |
|-------------------|------------------------------------|-----------------------|
| DB_NAME           | Nome do banco de dados             | projetobackend        |
| DB_USER           | Usuário do banco                   | root                  |
| DB_PASS           | Senha do banco                     | senha123              |
| DB_HOST           | Host do banco                      | localhost             |
| DB_PORT           | Porta do banco                     | 3306                  |
| JWT_SECRET        | Segredo para tokens JWT            | segredo_super_secreto |
| NODE_ENV          | Ambiente de execução               | development           |

## Estrutura do Projeto

```
project-root/
├── src/
│   ├── config/       # Configurações
│   ├── controllers/  # Lógica dos endpoints
│   ├── middleware/   # Middlewares
│   ├── models/       # Modelos do Sequelize
│   ├── routes/       # Definição de rotas
│   ├── services/     # Lógica de negócio
│   ├── app.js        # Config Express
│   └── server.js     # Inicialização
├── tests/            # Testes automatizados
├── .env              # Variáveis de ambiente
├── .gitignore
└── package.json
