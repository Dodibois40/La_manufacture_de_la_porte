# 🚪 La Manufacture de la Porte - Backend API

Backend Node.js/Express pour le système d'authentification et de gestion des configurations de porte.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- PostgreSQL 15+
- npm ou yarn

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# 3. Configurer la base de données
npm run db:generate
npm run db:migrate

# 4. (Optionnel) Ajouter des données de test
npm run db:seed

# 5. Démarrer en développement
npm run dev
```

## 📋 Scripts Disponibles

- `npm run dev` - Démarrage en mode développement avec hot-reload
- `npm run build` - Compilation TypeScript
- `npm run start` - Démarrage en production
- `npm run db:generate` - Générer le client Prisma
- `npm run db:migrate` - Appliquer les migrations
- `npm run db:studio` - Interface graphique Prisma Studio
- `npm run test` - Lancer les tests
- `npm run lint` - Vérification ESLint

## 🗄️ Base de Données

### Modèles Principaux
- **User** - Utilisateurs (clients, partenaires, admins)
- **Configuration** - Configurations de porte sauvegardées
- **Project** - Projets de partenaires
- **UserSession** - Sessions d'authentification
- **ActivityLog** - Logs d'audit

### Migrations
```bash
# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Appliquer en production
npx prisma migrate deploy
```

## 🔐 Authentification

### Endpoints
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchissement token
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/reset-password` - Réinitialisation

### Utilisation
```typescript
// Connexion
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

// Requêtes authentifiées
const response = await fetch('/api/configurations', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## ⚙️ API Configurations

### Endpoints
- `GET /api/configurations` - Liste des configurations
- `POST /api/configurations` - Créer une configuration
- `PUT /api/configurations/:id` - Modifier une configuration
- `DELETE /api/configurations/:id` - Supprimer une configuration

## 🏢 API Projets (Partenaires)

### Endpoints
- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Créer un projet
- `PUT /api/projects/:id` - Modifier un projet
- `POST /api/projects/:id/configurations` - Ajouter une config au projet

## 🛡️ Sécurité

- **JWT** avec expiration 24h
- **bcrypt** pour le hachage des mots de passe
- **Rate limiting** global et par endpoint
- **CORS** configuré pour le frontend
- **Helmet** pour les headers de sécurité
- **Validation** stricte de toutes les données
- **Logs d'audit** pour traçabilité

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Logs
- `logs/combined.log` - Tous les logs
- `logs/error.log` - Erreurs uniquement
- `logs/exceptions.log` - Exceptions non gérées

## 🚀 Déploiement

### Railway.app (Recommandé)
```bash
npm install -g @railway/cli
railway login
railway init
railway add postgresql
railway deploy
```

### Variables d'environnement Production
```env
NODE_ENV=production
DATABASE_URL=<railway-postgres-url>
JWT_SECRET=<secret-ultra-securise>
FRONTEND_URL=https://votre-site.netlify.app
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests avec watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📚 Documentation API

Une fois le serveur démarré, la documentation interactive sera disponible sur :
`http://localhost:3001/api/docs`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

**La Manufacture de la Porte** - Backend API v1.0.0
