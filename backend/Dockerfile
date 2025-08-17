# 🐳 Dockerfile - La Manufacture de la Porte Backend
FROM node:20-alpine

# 📋 Métadonnées
LABEL maintainer="La Manufacture de la Porte"
LABEL description="Backend API pour le configurateur de porte"

# 🔧 Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3001

# 👤 Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 📁 Répertoire de travail
WORKDIR /app

# 📦 Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# 🔧 Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# 📋 Générer le client Prisma
RUN npx prisma generate

# 📁 Copier le code source
COPY --chown=nextjs:nodejs . .

# 🏗️ Compiler TypeScript
RUN npm run build

# 👤 Changer vers l'utilisateur non-root
USER nextjs

# 🚀 Exposer le port
EXPOSE 3001

# 🏥 Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 🎯 Commande de démarrage
CMD ["npm", "start"]
