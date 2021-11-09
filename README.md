<!-- markdownlint-disable -->
# API Biblioteca

<span style="color:red; font-weight:bold; font-size: 24px">
🏗️ EM DESENVOLVIMENTO 🏗️
</span>
<br /><br />

API de biblioteca desenvolvida em NodeJS para fins de estudo, usando as ferramentas:

- Express
- ts-node-dev
- Typescript
- Axios
- Prisma
- ESlint
- Prettier

<br />

## Instalar

```bash
yarn install
```

\* Recomendado usar yarn para aproveitar o **yarn.lock**
<br /><br />

## Configurar ENV

Criar arquivo `.env` com as infos:

```bash
DATABASE_URL="file:./[NOME_DO_BANCO].db"
```

\* Exemplo: **DATABASE_URL="file:./dev.db"**

\* O Banco de dados configurado no projeto é SQLite
<br /><br />

## Rodar projeto

```bash
yarn start
```

\* Projeto irá rodar na **porta 3000**
<br /><br />

## Fix ESlint

```bash
yarn lint
```
<br />

## Fix Prettier

```bash
yarn prettier
```
