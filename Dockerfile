FROM node:20

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de configuração do Node.js
COPY package*.json ./
COPY src/ ./src/

# Instala as dependências do Node.js
RUN npm i

# Gera o cliente Prisma
RUN npm run prisma:generate

# Exponha a porta do aplicativo
EXPOSE 3000

# Comando para iniciar o seu aplicativo Node.js (altere conforme necessário)
CMD ["nest", "start"]
