# requires -Version 5.1
$ErrorActionPreference = 'Stop'

function Invoke-WithRetry {
  param(
    [Parameter(Mandatory=$true)][scriptblock]$Action,
    [int]$MaxAttempts = 3,
    [int]$DelaySeconds = 3
  )
  for ($i=1; $i -le $MaxAttempts; $i++) {
    try {
      return & $Action
    } catch {
      if ($i -ge $MaxAttempts) { throw }
      Start-Sleep -Seconds $DelaySeconds
    }
  }
}

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$appDir = Join-Path $root 'app'

if (-not (Test-Path $appDir)) {
  Write-Error "Projet introuvable dans $appDir. Lance d'abord scripts\\setup.ps1"
}

Push-Location $appDir
try {
  Invoke-WithRetry -Action { & npm run build }
  Write-Host "Build OK. Dossier dist prêt."
} finally {
  Pop-Location
}
