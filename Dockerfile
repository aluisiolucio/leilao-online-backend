# Etapa 1: Basear a imagem no Node.js
FROM node:22

# Criar um diretório de trabalho
WORKDIR /app

# Copiar os arquivos de definição de pacotes
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Gerar o cliente Prisma
RUN npx prisma generate

# Compilar TypeScript para JavaScript
RUN npm run build

# Expor a porta que a API vai utilizar
EXPOSE 3333

# Comando para executar a aplicação
CMD ["node", "dist/server.js"]
