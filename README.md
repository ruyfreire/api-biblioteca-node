<!-- markdownlint-disable -->
# API Biblioteca :books:  

[![CodeFactor](https://www.codefactor.io/repository/github/ruyfreire/api-biblioteca-node/badge)](https://www.codefactor.io/repository/github/ruyfreire/api-biblioteca-node)

## Descrição

API de biblioteca NodeJS para fins de estudo

## Dependências
- Node >= 14.18
- NPM >= 6.14
- Docker >= 20.10
- docker-compose >= 1.29

## Funcionalidades

- [x] Construir CRUD de `autor` e `livro`, com os mesmos atributos contidos no projeto da primeira biblioteca
- [x] Incluir swagger
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
- [Faker](https://github.com/faker-js/faker)

## Diretórios

```bash
├── prisma # Migrações, models prisma, banco de dados
├── src
│   ├── controllers # Controladores das rotas
│   ├── prisma # Instancia e configurações do prisma client
│   ├── routes # Rotas
│   ├── services # Serviços das rotas
│   ├── utils # Utilitários para logs, respostas http, validadores Yup, etc...
│   ├── index.ts # Arquivo inicial do projeto
│   ├── server.ts # Configuração do servidor
│   └── swagger.json # Documentação da API usando swagger
└── tests
    ├── integration # Testes de integração das rotas
    ├── utils # Utilitários para os testes
    └── jest-setup.js # Config jest durante os testes
```

## Configurar ENV

Criar arquivo `.env` com as infos:

| Nome | Padrão | Obrigatório | Descrição
| --- | --- | --- | ---
| `DATABASE_URL` | `null` | `Sim` | String de conexão com o banco de dados
| `PORT` | `3000` | `Não` | Porta que o servidor vai rodar

\* O Banco de dados configurado no projeto é `Postgres`

*Exemplo:*
```bash
DATABASE_URL="postgresql://username:password@hostname:5432/database?schema=public"
PORT=3000
```

## Docker / Banco de dados

```bash
# Subir container com banco de dados Postgres
docker-compose up
```

## Rodar projeto
\* Recomendado usar `npm` para aproveitar o `package-lock.json` e evitar comportamentos inesperados

```bash
# Instalar dependências
npm install

# Rodar migrações do banco de dados
npm run prisma:migrate_dev

# Carregar models do banco de dados no prisma
npm run prisma:generate

# Iniciar servidor
npm run start
```

## Rodar Prisma Studio
\* Visualizar dados do banco de dados com o prisma

```bash
npm run prisma:studio
```

## Build

```bash
# Build e gerar pasta dist
npm run build
```

## Rodar testes

```bash
# Container do banco de dados precisa estar rodando
npm run test
```

## Rodar ESlint

```bash
npm run lint
```

## Rodar Prettier

```bash
npm run prettier
```
