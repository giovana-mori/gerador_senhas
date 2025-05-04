FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências primeiro para aproveitar cache
COPY package*.json ./

# Instalar dependências de produção
RUN npm install --production

# Copiar o restante dos arquivos
COPY . .

# Expor a porta da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["node", "index.js"]