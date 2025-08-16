# Étape 1 : image officielle Node
FROM node:18

# Étape 2 : définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : copier uniquement les fichiers de dépendances
COPY package*.json ./

# Étape 4 : installer les dépendances
RUN npm install

# Étape 5 : copier le reste du projet
COPY . .

# Étape 6 : exposer le port utilisé par le backend
EXPOSE 5000

# Étape 7 : lancer le backend en mode développement
CMD ["npm", "run", "dev"]
