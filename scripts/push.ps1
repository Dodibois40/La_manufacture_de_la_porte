# requires -Version 5.1
param(
  [string]$Message = "chore: update $(Get-Date -Format 'yyyy-MM-dd_HHmmss')"
)
$ErrorActionPreference = 'Stop'

function Invoke-Safe {
  param([string]$Cmd)
  & powershell -NoProfile -Command $Cmd | Out-Null
}

# Désactiver tout pager éventuel
& git config --global core.pager cat | Out-Null

# Stager
& git add -A | Out-Null

# Commit seulement si quelque chose est staged
$staged = & git diff --cached --name-only
if ($staged) {
  & git commit -m $Message | Out-Null
}

# Push
& git push | Out-Null
Write-Host "Push terminé."
