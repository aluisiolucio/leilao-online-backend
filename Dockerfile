# Usar a imagem base do Node.js
FROM node:20

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de definição de pacotes para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências definidas nos arquivos de pacote
RUN npm install

# Copiar todos os arquivos do diretório atual para o diretório de trabalho
COPY . .

# Gerar os artefatos do Prisma
RUN npx prisma generate

# Construir a aplicação
RUN npm run build

# Expor a porta 3000
EXPOSE 3000

# Configurar a variável de ambiente para o fuso horário desejado
ENV TZ=America/Sao_Paulo

# Executar comandos para garantir que o fuso horário está correto
# Configura /etc/localtime e grava a localização do fuso horário em /etc/timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Definir o comando a ser executado quando o container é iniciado
CMD ["node", "dist/server.js"]
