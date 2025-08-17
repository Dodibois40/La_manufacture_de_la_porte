# 🚀 Plan de Développement Backend
## La Manufacture de la Porte - Authentification & API

---

## 🎯 Phase 1: Setup Initial (Jour 1-2)

### 🏗️ Création du Projet Backend

#### Structure initiale
```bash
mkdir backend
cd backend
npm init -y
npm install express typescript @types/node @types/express
npm install prisma @prisma/client
npm install bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken
npm install cors helmet express-rate-limit
npm install joi winston
npm install nodemailer @types/nodemailer
npm install --save-dev ts-node nodemon @types/cors
```

#### Configuration TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Variables d'environnement
```env
# .env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/manufacture_porte"
JWT_SECRET="votre-secret-jwt-ultra-securise"
JWT_EXPIRES_IN="24h"
FRONTEND_URL="http://localhost:5173"

# Email (pour notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"

# Sécurité
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 🗄️ Configuration Base de Données

#### Installation PostgreSQL locale
```bash
# Windows (via Chocolatey)
choco install postgresql

# Ou via Docker
docker run --name postgres-manufacture -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

#### Schema Prisma
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  CLIENT
  PARTNER
  ADMIN
}

enum ProjectStatus {
  DRAFT
  QUOTED
  APPROVED
  IN_PRODUCTION
  COMPLETED
  CANCELLED
}

model User {
  id              Int       @id @default(autoincrement())
  email           String    @unique
  passwordHash    String    @map("password_hash")
  displayName     String    @map("display_name")
  role            UserRole  @default(CLIENT)
  company         String?
  phone           String?
  address         String?
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  lastLogin       DateTime? @map("last_login")
  isActive        Boolean   @default(true) @map("is_active")
  emailVerified   Boolean   @default(false) @map("email_verified")
  verificationToken String? @map("verification_token")

  sessions        UserSession[]
  configurations  Configuration[]
  projects        Project[]
  activityLogs    ActivityLog[]

  @@map("users")
}

model UserSession {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  tokenHash String   @map("token_hash")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_sessions")
}

model Configuration {
  id           Int       @id @default(autoincrement())
  userId       Int       @map("user_id")
  name         String
  description  String?
  svgOriginal  String?   @map("svg_original")
  svgModified  String?   @map("svg_modified")
  parameters   Json
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  isPublic     Boolean   @default(false) @map("is_public")
  isTemplate   Boolean   @default(false) @map("is_template")
  tags         String[]

  user                 User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  projectConfigurations ProjectConfiguration[]

  @@map("configurations")
}

model Project {
  id           Int           @id @default(autoincrement())
  partnerId    Int           @map("partner_id")
  clientName   String        @map("client_name")
  clientEmail  String?       @map("client_email")
  clientPhone  String?       @map("client_phone")
  clientAddress String?      @map("client_address")
  projectName  String        @map("project_name")
  description  String?
  status       ProjectStatus @default(DRAFT)
  quotedPrice  Decimal?      @map("quoted_price") @db.Decimal(10, 2)
  finalPrice   Decimal?      @map("final_price") @db.Decimal(10, 2)
  notes        String?
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")
  deadline     DateTime?

  partner       User                   @relation(fields: [partnerId], references: [id])
  configurations ProjectConfiguration[]

  @@map("projects")
}

model ProjectConfiguration {
  id              Int      @id @default(autoincrement())
  projectId       Int      @map("project_id")
  configurationId Int      @map("configuration_id")
  quantity        Int      @default(1)
  unitPrice       Decimal? @map("unit_price") @db.Decimal(10, 2)
  notes           String?
  createdAt       DateTime @default(now()) @map("created_at")

  project       Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)
  configuration Configuration @relation(fields: [configurationId], references: [id], onDelete: Cascade)

  @@map("project_configurations")
}

model ActivityLog {
  id           Int      @id @default(autoincrement())
  userId       Int?     @map("user_id")
  action       String
  resourceType String?  @map("resource_type")
  resourceId   Int?     @map("resource_id")
  details      Json?
  ipAddress    String?  @map("ip_address")
  userAgent    String?  @map("user_agent")
  createdAt    DateTime @default(now()) @map("created_at")

  user User? @relation(fields: [userId], references: [id])

  @@map("activity_logs")
}
```

---

## 🎯 Phase 2: API Core (Jour 3-5)

### 🔧 Structure de Base

#### Point d'entrée (src/app.ts)
```typescript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { authRoutes } from './routes/auth.routes'
import { configRoutes } from './routes/config.routes'
import { projectRoutes } from './routes/project.routes'
import { errorHandler } from './middleware/error.middleware'

const app = express()

// Middleware de sécurité
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite par IP
})
app.use(limiter)

// Parsing JSON
app.use(express.json({ limit: '10mb' })) // Pour les SVG volumineux

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/configurations', configRoutes)
app.use('/api/projects', projectRoutes)

// Gestion d'erreurs
app.use(errorHandler)

export default app
```

#### Contrôleur d'Authentification
```typescript
// src/controllers/auth.controller.ts
import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { registerSchema, loginSchema } from '../utils/validation.utils'

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { error, value } = registerSchema.validate(req.body)
      if (error) return res.status(400).json({ error: error.details[0].message })

      const result = await AuthService.register(value)
      res.status(201).json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { error, value } = loginSchema.validate(req.body)
      if (error) return res.status(400).json({ error: error.details[0].message })

      const result = await AuthService.login(value, req.ip, req.get('User-Agent'))
      res.json(result)
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      await AuthService.logout(token)
      res.json({ success: true })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}
```

---

## 🎯 Phase 3: Frontend Integration (Jour 6-8)

### 🔐 Contexte d'Authentification React

```typescript
// src/contexts/AuthContext.tsx
interface User {
  id: number
  email: string
  displayName: string
  role: 'client' | 'partner' | 'admin'
  company?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Vérifier le token au chargement
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Vérifier la validité du token
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) throw new Error('Échec de la connexion')
    
    const { user, token } = await response.json()
    localStorage.setItem('auth_token', token)
    setUser(user)
  }

  // ... autres méthodes
}
```

### 🛡️ Protection des Routes

```typescript
// src/components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback = <Navigate to="/login" /> 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>
  }

  if (!user) {
    return fallback
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div className="access-denied">Accès non autorisé</div>
  }

  return <>{children}</>
}
```

### 📱 Page de Login Gaming

```typescript
// src/pages/LoginPage.tsx
export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    company: ''
  })

  return (
    <div className="auth-gaming">
      {/* Fond parallax similaire à la home */}
      <div className="auth-bg"></div>
      
      {/* Logo centré */}
      <div className="auth-logo">
        <img src={logoImg} alt="La Manufacture de la Porte" />
      </div>

      {/* Formulaire gaming */}
      <div className="auth-container">
        <div className="auth-form gaming-panel">
          <h2 className="auth-title">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h2>

          {/* Formulaire avec style gaming */}
          <form onSubmit={handleSubmit}>
            <div className="field-gaming">
              <input 
                type="email" 
                placeholder="Email"
                className="input-gaming"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="field-gaming">
              <input 
                type="password" 
                placeholder="Mot de passe"
                className="input-gaming"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {mode === 'register' && (
              <>
                <div className="field-gaming">
                  <input 
                    type="text" 
                    placeholder="Nom complet"
                    className="input-gaming"
                    value={formData.displayName}
                    onChange={e => setFormData({...formData, displayName: e.target.value})}
                  />
                </div>
                
                <div className="field-gaming">
                  <select className="select-gaming">
                    <option value="client">Client particulier</option>
                    <option value="partner">Partenaire professionnel</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="btn-gaming primary">
              <span className="btn-text">
                {mode === 'login' ? 'Se connecter' : 'Créer le compte'}
              </span>
              <div className="btn-glow"></div>
            </button>
          </form>

          {/* Toggle mode */}
          <div className="auth-toggle">
            {mode === 'login' ? (
              <p>
                Pas encore de compte ? 
                <button className="link-gaming" onClick={() => setMode('register')}>
                  Créer un compte
                </button>
              </p>
            ) : (
              <p>
                Déjà un compte ? 
                <button className="link-gaming" onClick={() => setMode('login')}>
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 🎯 Phase 4: Fonctionnalités Avancées (Jour 9-12)

### 💾 Sauvegarde des Configurations

```typescript
// Integration dans ConfigPage.tsx
const { user } = useAuth()

const saveConfiguration = async () => {
  if (!user || !svgString) return

  const configData = {
    name: `Configuration ${new Date().toLocaleDateString()}`,
    svgOriginal: originalSvgString, // SVG non modifié
    svgModified: svgString,         // SVG avec modifications
    parameters: values,             // Valeurs des cotations
    tags: ['porte', 'sur-mesure']
  }

  try {
    const response = await fetch('/api/configurations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(configData)
    })

    if (response.ok) {
      setWarning('Configuration sauvegardée avec succès !')
    }
  } catch (error) {
    setWarning('Erreur lors de la sauvegarde')
  }
}

// Ajouter le bouton dans l'interface
<button type="button" onClick={saveConfiguration} disabled={!user}>
  💾 Sauvegarder la configuration
</button>
```

### 📊 Dashboard Utilisateur

```typescript
// src/pages/DashboardPage.tsx
export default function DashboardPage() {
  const { user } = useAuth()
  const [configurations, setConfigurations] = useState([])
  const [projects, setProjects] = useState([])

  return (
    <div className="dashboard-gaming">
      <h1>Tableau de bord - {user?.displayName}</h1>
      
      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Configurations</h3>
          <span className="stat-number">{configurations.length}</span>
        </div>
        
        {user?.role === 'partner' && (
          <div className="stat-card">
            <h3>Projets actifs</h3>
            <span className="stat-number">{projects.filter(p => p.status !== 'completed').length}</span>
          </div>
        )}
      </div>

      {/* Liste des configurations */}
      <div className="config-list">
        {configurations.map(config => (
          <div key={config.id} className="config-card gaming-panel">
            <h4>{config.name}</h4>
            <p>{config.description}</p>
            <div className="config-actions">
              <button onClick={() => loadConfiguration(config)}>Charger</button>
              <button onClick={() => duplicateConfiguration(config)}>Dupliquer</button>
              <button onClick={() => deleteConfiguration(config.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🚀 Déploiement

### Backend (Railway.app)
```bash
# Connexion Railway
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

### Frontend (Netlify)
```env
# netlify.toml - Ajouter variables d'env
[build.environment]
VITE_API_BASE_URL = "https://votre-backend.railway.app"
```

---

## 📋 Checklist de Développement

### Phase 1: Backend Foundation
- [ ] Setup projet Node.js/TypeScript
- [ ] Configuration PostgreSQL + Prisma
- [ ] Modèles de données (User, Configuration, Project)
- [ ] Middleware de sécurité (auth, rate limiting)

### Phase 2: API Authentification
- [ ] Endpoint register/login/logout
- [ ] Gestion des tokens JWT
- [ ] Validation des données
- [ ] Tests unitaires

### Phase 3: Frontend Auth
- [ ] Contexte d'authentification React
- [ ] Page de login avec design gaming
- [ ] Protection des routes
- [ ] Gestion des erreurs

### Phase 4: Fonctionnalités Métier
- [ ] Sauvegarde des configurations
- [ ] Dashboard utilisateur
- [ ] Gestion des projets (partenaires)
- [ ] Export et partage

### Phase 5: Production
- [ ] Déploiement backend (Railway)
- [ ] Configuration CORS production
- [ ] Tests d'intégration
- [ ] Documentation API

---

*Plan créé le 17 août 2025*
*Estimation : 12 jours de développement*
