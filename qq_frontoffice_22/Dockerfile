FROM node:18

# Crée le dossier de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Expose le port de Vite (ou React)
EXPOSE 5173

# Démarre le serveur de dev
CMD ["npm", "run", "dev"]
