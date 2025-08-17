# 🚀 Script de Développement - La Manufacture de la Porte Backend

Write-Host "🚪 La Manufacture de la Porte - Backend API" -ForegroundColor Yellow
Write-Host "Démarrage du serveur de développement..." -ForegroundColor Green

# Vérifier si .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Fichier .env manquant!" -ForegroundColor Red
    Write-Host "Copiez .env.example vers .env et configurez vos variables" -ForegroundColor Yellow
    exit 1
}

# Vérifier si PostgreSQL est accessible
Write-Host "🔍 Vérification de la base de données..." -ForegroundColor Cyan

try {
    # Tenter de générer le client Prisma
    npm run db:generate
    Write-Host "✅ Client Prisma généré" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur avec Prisma. Vérifiez votre DATABASE_URL" -ForegroundColor Red
    exit 1
}

# Démarrer le serveur de développement
Write-Host "🚀 Démarrage du serveur..." -ForegroundColor Green
Write-Host "📊 Logs disponibles dans logs/" -ForegroundColor Cyan
Write-Host "🏥 Health check: http://localhost:3001/health" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:3001/api/docs" -ForegroundColor Cyan
Write-Host "" 
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Yellow

npm run dev
