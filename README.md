# News Explorer Back-end

Back-end do projeto final News Explorer, desenvolvido com Node.js, Express e MongoDB.

## Links

API em produção:
https://news-explorer-backend-qkf8.onrender.com

URL base da API:
https://news-explorer-backend-qkf8.onrender.com/api

Pull Request:
https://github.com/malupcosta/news-explorer-backend/pull/1

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Celebrate/Joi
- Winston
- Helmet
- Express Rate Limit
- CORS

## Rotas públicas

POST /api/signup

Cria um novo usuário.

Campos esperados:

- email
- password
- name

POST /api/signin

Autentica o usuário e retorna um token JWT.

Campos esperados:

- email
- password

## Rotas protegidas

As rotas protegidas exigem o header Authorization com Bearer Token.

GET /api/users/me

Retorna os dados do usuário atual.

GET /api/articles

Retorna os artigos salvos do usuário atual.

POST /api/articles

Salva um artigo.

Campos esperados:

- keyword
- title
- text
- date
- source
- link
- image

DELETE /api/articles/:articleId

Remove um artigo salvo pelo usuário atual.

## Como rodar localmente

Instalar dependências:

npm install

Rodar em desenvolvimento:

npm run dev

Rodar lint:

npm run lint

## Variáveis de ambiente

Em produção, o projeto usa:

NODE_ENV=production
JWT_SECRET=chave-secreta
MONGO_URL=mongodb+srv://usuario:senha@cluster.mongodb.net/news-explorer
