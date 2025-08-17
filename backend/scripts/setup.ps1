# 🔧 Script de Setup - La Manufacture de la Porte Backend

Write-Host "🚪 La Manufacture de la Porte - Setup Backend" -ForegroundColor Yellow
Write-Host "Installation et configuration initiale..." -ForegroundColor Green

# 1. Installer les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

# 2. Copier le fichier d'environnement
if (-not (Test-Path ".env")) {
    Write-Host "📋 Création du fichier .env..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Fichier .env créé. Veuillez le configurer avec vos paramètres." -ForegroundColor Green
} else {
    Write-Host "✅ Fichier .env déjà présent" -ForegroundColor Green
}

# 3. Créer le dossier logs
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
    Write-Host "✅ Dossier logs créé" -ForegroundColor Green
}

# 4. Générer le client Prisma
Write-Host "🗄️ Génération du client Prisma..." -ForegroundColor Cyan
npm run db:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la génération Prisma" -ForegroundColor Red
    Write-Host "Vérifiez votre DATABASE_URL dans .env" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup terminé avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Configurez votre .env avec vos paramètres" -ForegroundColor White
Write-Host "   2. Créez votre base de données PostgreSQL" -ForegroundColor White
Write-Host "   3. Lancez: npm run db:migrate" -ForegroundColor White
Write-Host "   4. (Optionnel) Ajoutez des données de test: npm run db:seed" -ForegroundColor White
Write-Host "   5. Démarrez le serveur: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Commandes utiles:" -ForegroundColor Yellow
Write-Host "   npm run dev          - Serveur de développement" -ForegroundColor White
Write-Host "   npm run db:studio    - Interface graphique Prisma" -ForegroundColor White
Write-Host "   npm run db:migrate   - Appliquer les migrations" -ForegroundColor White
Write-Host "   npm test             - Lancer les tests" -ForegroundColor White
