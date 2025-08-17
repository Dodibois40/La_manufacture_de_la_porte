# requires -Version 5.1
$ErrorActionPreference = 'Stop'

function Assert-Cli {
  param([string]$Cmd, [string]$InstallMsg)
  try {
    $v = & $Cmd --version 2>$null
    if (-not $v) { $v = & $Cmd -v 2>$null }
  } catch {
    Write-Error "$Cmd introuvable. $InstallMsg"
  }
}

Assert-Cli -Cmd 'node' -InstallMsg 'Installe Node.js LTS depuis https://nodejs.org/'
Assert-Cli -Cmd 'npm' -InstallMsg 'npm manquant. Réinstalle Node.js LTS.'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$appDir = Join-Path $root 'app'

if (-not (Test-Path $appDir)) {
  Write-Error "Projet introuvable dans $appDir. Lance d'abord scripts\\setup.ps1"
}

Write-Host "Démarrage du serveur de dev... (Ctrl+C pour arrêter)"
Push-Location $appDir
try {
  :loop while ($true) {
    try {
      & npm run dev
      # Si le processus se termine, on relance (sur crash). Ctrl+C pour quitter.
    } catch {
      Start-Sleep -Seconds 2
      continue loop
    }
  }
} finally {
  Pop-Location
}
