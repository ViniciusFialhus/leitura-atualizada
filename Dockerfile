# FROM node:20

# # Define o diretório de trabalho dentro do contêiner
# WORKDIR /usr

# # Copia os arquivos de configuração do Node.js
# COPY ./src/ ./src/
# COPY ./prisma/ ./prisma/
# COPY ./*.json ./

# # Instala as dependências do Node.js
# RUN npm i

# # Gera o cliente Prisma
# RUN npm run prisma:generate

# # Exponha a porta do aplicativo
# EXPOSE 3000

# # Comando para iniciar o seu aplicativo Node.js (altere conforme necessário)
# CMD ["nest", "start"]


# Usa a imagem oficial do Node.js versão 20 como base
FROM node:20

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de configuração do Node.js e outros arquivos necessários
COPY ./src ./src/
COPY ./prisma ./prisma/
COPY ./*.json ./

# Instala as dependências do Node.js
RUN npm install

# Gera o cliente Prisma (se necessário)
RUN npm run prisma:generate

# Expõe a porta 3000 para o aplicativo
EXPOSE 3000

# Comando para iniciar o aplicativo Node.js
CMD ["npm", "start"]
