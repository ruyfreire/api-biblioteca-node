FROM node:16-alpine

# Criar diretorio para ficar o app
WORKDIR /usr/src/app

# Copiar arquivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar Pacotes
RUN npm install

# Copia código fonte
COPY . .

# Preparar prisma
RUN npm run prisma:generate

# Gerar build
RUN npm run build

# Expor porta utilizada pelo app
EXPOSE 3001

# Executar app
CMD [ "node", "dist/index.js" ]
