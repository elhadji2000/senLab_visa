FROM node:18

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances d'abord pour le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port Vite (5173)
EXPOSE 5174

# Démarrer Vite (dev mode)
CMD ["npm", "run", "dev"]
