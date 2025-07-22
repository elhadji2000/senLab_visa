# Étape 1 : image officielle Node
FROM node:18

# Étape 2 : définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Étape 4 : copier tout le projet
COPY . .

# Étape 5 : exposer le port utilisé par le backend
EXPOSE 5000

# Étape 6 : démarrer le serveur
CMD ["npm", "start"]
