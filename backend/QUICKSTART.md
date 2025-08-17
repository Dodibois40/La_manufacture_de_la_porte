# 🚀 Démarrage Rapide - Backend API
## La Manufacture de la Porte

---

## ⚡ Installation Express (5 minutes)

### 1. 📦 Installer les dépendances
```powershell
cd backend
.\scripts\setup.ps1
```

### 2. 🗄️ Configurer PostgreSQL

#### Option A: Docker (Recommandé)
```powershell
docker-compose up -d postgres
```

#### Option B: Installation locale
```powershell
# Installer PostgreSQL via Chocolatey
choco install postgresql

# Créer la base de données
createdb manufacture_porte
```

### 3. 🔧 Configuration
```powershell
# Éditer .env avec vos paramètres
notepad .env

# Variables importantes:
# DATABASE_URL="postgresql://postgres:password123@localhost:5432/manufacture_porte"
# JWT_SECRET="votre-secret-ultra-securise-minimum-32-caracteres"
```

### 4. 🗄️ Initialiser la base de données
```powershell
npm run db:migrate
npm run db:seed  # Optionnel: données de test
```

### 5. 🚀 Démarrer le serveur
```powershell
npm run dev
```

**✅ API disponible sur : http://localhost:3001**

---

## 🧪 Test de l'API

### 🔐 Test d'authentification
```bash
# Inscription
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "displayName": "Test User"
  }'

# Connexion
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### ⚙️ Test des configurations
```bash
# Créer une configuration (avec token)
curl -X POST http://localhost:3001/api/configurations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Ma Porte Test",
    "svgModified": "<svg>...</svg>",
    "parameters": {
      "OUVERTURE_L": "902",
      "PORTE_L": "816"
    }
  }'
```

---

## 🎯 Comptes de Test (après seeding)

| Rôle | Email | Mot de passe | Description |
|------|-------|--------------|-------------|
| Admin | admin@manufacture-porte.com | Admin123! | Administrateur |
| Client | client@test.com | Client123! | Client particulier |
| Partenaire | partenaire@test.com | Partner123! | Partenaire professionnel |

---

## 🔧 Commandes Utiles

```powershell
# Développement
npm run dev              # Serveur avec hot-reload
npm run build            # Compilation TypeScript
npm run start            # Serveur de production

# Base de données
npm run db:generate      # Générer client Prisma
npm run db:migrate       # Appliquer migrations
npm run db:studio        # Interface graphique Prisma
npm run db:seed          # Données de test

# Qualité de code
npm run lint             # Vérification ESLint
npm run test             # Tests unitaires
```

---

## 🏥 Endpoints Principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Configurations
- `GET /api/configurations` - Liste des configurations
- `POST /api/configurations` - Créer une configuration
- `PUT /api/configurations/:id` - Modifier
- `DELETE /api/configurations/:id` - Supprimer

### Projets (Partenaires)
- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Créer un projet
- `GET /api/projects/:id/quote` - Générer un devis

### Utilitaires
- `GET /health` - Health check
- `GET /` - Informations de l'API

---

## 🐳 Docker (Alternative)

```powershell
# Démarrer tout avec Docker
docker-compose up -d

# Logs
docker-compose logs -f api

# Arrêter
docker-compose down
```

---

## 🚀 Déploiement Production

### Railway.app
```powershell
npm install -g @railway/cli
railway login
railway init
railway add postgresql
railway deploy
```

### Variables d'environnement à configurer
- `JWT_SECRET` (secret sécurisé)
- `FRONTEND_URL` (URL de votre site Netlify)
- `SMTP_*` (configuration email)

---

**🎉 Votre backend est prêt !**
