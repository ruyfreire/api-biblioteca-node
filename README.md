<!-- markdownlint-disable -->
# API Biblioteca :books:  

[![CodeFactor](https://www.codefactor.io/repository/github/ruyfreire/api-biblioteca-node/badge)](https://www.codefactor.io/repository/github/ruyfreire/api-biblioteca-node)

## Descrição

🏗️ **`EM DESENVOLVIMENTO`** 🏗️

API de biblioteca sendo desenvolvida em NodeJS para fins de estudo

## Funcionalidades

- [x] Construir CRUD de `autor` e `livro`, com os mesmos atributos contidos no projeto da primeira biblioteca
- [ ] Incluir novos campos no cadastro de autor e livro
- [ ] Incluir sistema de empréstimo de livros
- [ ] Incluir notificações via socket 

## Tecnologias

- [Express](https://github.com/expressjs/express)
- [ts-node-dev](https://github.com/wclr/ts-node-dev)
- [Typescript](https://github.com/microsoft/TypeScript)
- [Axios](https://github.com/axios/axios)
- [Prisma](https://github.com/prisma/prisma)
- [Yup](https://github.com/jquense/yup)
- [winston](https://github.com/winstonjs/winston)
- [supertest](https://github.com/visionmedia/supertest)
- [jest](https://github.com/facebook/jest)
- [ESlint](https://github.com/eslint/eslint)
- [Prettier](https://github.com/prettier/prettier)

## Diretórios

```bash
├── prisma # Migrações, models prisma, banco de dados (SQlite)
├── src
│   ├── controllers # Controladores das rotas
│   ├── prisma # Instancia e configurações do prisma client
│   ├── routes # Rotas
│   ├── services # Serviços das rotas
│   └── utils # Utilitários para logs, respostas http, validadores Yup, etc...
├── tests
│   ├── integration # Testes de integração das rotas
│   ├── utils # Utilitários para os testes
│   └── jest-setup.js # Config jest durante os testes
├── index.ts # Arquivo inicial do projeto
└── server.ts # Configuração do servidor
```

## Instalar

```bash
yarn install
```
\* Recomendado usar yarn para aproveitar o **yarn.lock**

## Configurar ENV

Criar arquivo `.env` com as infos:

| Nome | Padrão | Obrigatório | Descrição
| --- | --- | --- | ---
| `DATABASE_URL` | `null` | `Sim` | Nome do arquivo de banco de dados
| `PORT` | `3000` | `Não` | Porta que o servidor vai rodar

\* O Banco de dados configurado no projeto é `SQLite`

*Exemplo:*
```bash
DATABASE_URL="file:./dev.db"
PORT=3000
```

## Rodar projeto

```bash
# Instalar dependências
yarn install

# Rodar migrações do banco Sqlite
yarn migrate:dev

# Iniciar servidor
yarn start
```

## Rodar Prisma Studio `Visualizar dados em banco`

```bash
yarn prisma:studio
```

## Build

```bash
yarn build
```

## Rodar testes

```bash
yarn test
```

## Rodar ESlint

```bash
yarn lint
```

## Rodar Prettier

```bash
yarn prettier
```
