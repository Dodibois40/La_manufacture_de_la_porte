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
$appName = 'app'
$appDir = Join-Path $root $appName

if (-not (Test-Path $appDir)) {
  Write-Host "Création du projet Vite React TS dans $appDir ..."
  Invoke-WithRetry -Action {
    Push-Location $root
    try {
      & npm create vite@latest $appName -- --template react-ts
    } finally {
      Pop-Location
    }
  }
} else {
  Write-Host "Projet déjà présent, étape de création ignorée."
}

Write-Host "Installation des dépendances..."
Invoke-WithRetry -Action {
  Push-Location $appDir
  try {
    & npm install
  } finally {
    Pop-Location
  }
}

# Préparer le code source (MVP)
$AppTsx = @'
import { useEffect, useRef, useState } from 'react'
import './index.css'

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/site-web-commande-panneaux.firebasestorage.app/o/Logo%2FSans-titre---2-%5BR%C3%A9cup%C3%A9r%C3%A9%5D.png?alt=media&token=857a8d48-d4a3-4533-86a5-2d62067b963e'

function replaceFirstNumber(text: string, newNumber: string): string {
  const re = /(\d+(?:\.\d+)?)/ // point décimal
  if (!re.test(text)) return text
  return text.replace(re, newNumber)
}

export default function App() {
  const [svgString, setSvgString] = useState<string>('')
  const svgDocRef = useRef<Document | null>(null)

  const [ouvertureL, setOuvertureL] = useState<string>('902')
  const [warning, setWarning] = useState<string>('')

  const [zoom, setZoom] = useState<number>(1)

  function onOpenFile(file: File) {
    setWarning('')
    file.text().then(text => {
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
      svgDocRef.current = doc
      const serialized = new XMLSerializer().serializeToString(doc.documentElement)
      setSvgString(serialized)
      apply()
    }).catch(() => {
      setWarning('Erreur de lecture du fichier SVG.')
    })
  }

  function apply() {
    const doc = svgDocRef.current
    if (!doc) return
    const node = doc.getElementById('OUVERTURE_L') as (SVGTextElement | null)
    if (!node) {
      setWarning('Token OUVERTURE_L introuvable dans le SVG.')
      return
    }
    const val = ouvertureL.trim()
    const tspans = Array.from(node.getElementsByTagName('tspan'))
    let target: Element = node
    let content = node.textContent ?? ''

    const withDigits = tspans.find(t => /\d/.test(t.textContent ?? ''))
    if (withDigits) {
      target = withDigits
      content = withDigits.textContent ?? ''
    }

    const newText = replaceFirstNumber(content, val)
    ;(target as any).textContent = newText

    const serialized = new XMLSerializer().serializeToString(doc.documentElement)
    setSvgString(serialized)
  }

  function download() {
    const doc = svgDocRef.current
    if (!doc) return
    const s = new XMLSerializer().serializeToString(doc.documentElement)
    const blob = new Blob([s], { type: 'image/svg+xml;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'plan_modifie.svg'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) onOpenFile(f)
  }

  useEffect(() => {
    // Rien au mount
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <img src={LOGO_URL} alt="Logo" className="logo"/>
        <h1>La Manufacture de la porte intérieur</h1>
      </header>

      <div className="layout">
        <aside className="side">
          <div className="field">
            <label className="label">Ouvrir SVG</label>
            <input type="file" accept="image/svg+xml" onChange={onFileInput} />
          </div>

          <div className="field">
            <label className="label">Ouverture L (mm)</label>
            <input
              type="number"
              step="0.1"
              value={ouvertureL}
              onChange={e => setOuvertureL(e.target.value)}
              onBlur={apply}
            />
          </div>

          <div className="field">
            <label className="label">Zoom</label>
            <div className="zoom-row">
              <button type="button" onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))}>-</button>
              <span className="zoom-val">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom(z => Math.min(4, +(z + 0.1).toFixed(2)))}>+</button>
              <button type="button" className="ghost" onClick={() => setZoom(1)}>100%</button>
            </div>
          </div>

          <div className="actions">
            <button type="button" onClick={apply}>Appliquer</button>
            <button type="button" onClick={download} disabled={!svgString}>Télécharger SVG</button>
          </div>

          {warning && <div className="warn">{warning}</div>}

          <div className="note">
            Modifie uniquement les chiffres des cotations. Aucun recalcul de géométrie.
          </div>
        </aside>

        <main className="preview-wrap">
          <div
            className="preview"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: svgString || '<div class="placeholder">Aucun SVG chargé</div>' }}
          />
        </main>
      </div>
    </div>
  )
}
'@

$MainTsx = @'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
'@

$IndexCss = @'
:root {
  --bg: #1A1A1A;
  --panel: #333333;
  --text: #EAEAEA;
  --text-2: #A0A0A0;
  --border: #444444;
  --accent: #98FF66;
}

* { box-sizing: border-box; }
html, body, #root { height: 100%; }
body { margin: 0; background: var(--bg); color: var(--text); font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

.app-header {
  height: 56px; display: flex; align-items: center; gap: 12px;
  padding: 0 16px; border-bottom: 1px solid var(--border); background: #1A1A1A;
}
.logo { height: 28px; width: auto; object-fit: contain; }

.layout { display: grid; grid-template-columns: 320px 1fr; height: calc(100% - 56px); }
.side {
  background: var(--panel); border-right: 1px solid var(--border);
  padding: 16px; overflow: auto;
}
.field { display: grid; gap: 8px; margin-bottom: 16px; }
.label { color: var(--text-2); font-size: 12px; }
input[type="number"], input[type="text"] {
  background: #262626; color: var(--text); border: 1px solid var(--border);
  padding: 8px 10px; border-radius: 6px; outline: none;
}
input[type="file"] { color-scheme: dark; }

.actions { display: flex; gap: 8px; margin: 12px 0 8px; }
button {
  background: #2A2A2A; color: var(--text); border: 1px solid var(--border);
  padding: 8px 12px; border-radius: 6px; cursor: pointer;
}
button:hover { border-color: var(--accent); }
button.ghost { background: transparent; }
button:disabled { opacity: .6; cursor: not-allowed; }

.zoom-row { display: flex; align-items: center; gap: 8px; }
.zoom-val { width: 56px; text-align: center; color: var(--text-2); }

.preview-wrap { position: relative; overflow: auto; background: #1A1A1A; }
.preview {
  transform-origin: 0 0; padding: 16px;
}
.placeholder {
  color: var(--text-2); font-size: 13px; border: 1px dashed var(--border);
  padding: 16px; border-radius: 8px;
}

.warn {
  margin-top: 8px; color: #222; background: #FFD166; border: 1px solid #E0B94D;
  padding: 8px 10px; border-radius: 6px; font-size: 12px;
}
.note { margin-top: 8px; color: var(--text-2); font-size: 12px; }
'@

# Assurer l'existence du dossier src
$srcDir = Join-Path $appDir 'src'
if (-not (Test-Path $srcDir)) { New-Item -ItemType Directory -Path $srcDir | Out-Null }

Set-Content -Path (Join-Path $appDir 'src\App.tsx') -Value $AppTsx -Encoding UTF8
Set-Content -Path (Join-Path $appDir 'src\main.tsx') -Value $MainTsx -Encoding UTF8
Set-Content -Path (Join-Path $appDir 'src\index.css') -Value $IndexCss -Encoding UTF8

Write-Host "Setup terminé. Prochaine étape: exécuter scripts\\dev.ps1 pour démarrer le serveur."
