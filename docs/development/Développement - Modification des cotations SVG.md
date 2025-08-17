# Développement — Programme de modification des cotations SVG

## 1) Objectif
- Charger un fichier SVG (export Illustrator/LayOut), identifier des textes de cotations par `id`, et remplacer uniquement la partie numérique des valeurs (ex.: `902` → `930`).
- Ne jamais recalculer la géométrie. Ne pas modifier l’unité si déjà présente dans le contenu (`mm`).
- MVP: prise en charge du token `OUVERTURE_L` uniquement.

## 2) Conventions SVG
- Chaque valeur modifiable est un texte non vectorisé (`<text>` ou `<tspan>`) avec un `id` unique (MAJUSCULES, sans espaces, pas d’accents).
- Exemple attendu:
```xml
<text id="OUVERTURE_L" class="cls-4" transform="translate(681 513)">902 mm</text>
```
- Les cotations peuvent contenir des `<tspan>` imbriqués. On privilégie la modification du premier `tspan` qui contient des chiffres, sinon on modifie directement le contenu du `<text>`.

## 3) Règles fonctionnelles
- Remplacer uniquement les chiffres (décimale avec un point), conserver le reste du texte (« mm », espaces, ponctuation) tel quel.
- Décimale: point `.` (ex.: `69.5`).
- Si le token ciblé est introuvable → message discret d’avertissement.
- Zoom disponible (100% par défaut), sans altérer le SVG.
- Décisions validées:
  - `PASSAGE_NET`: saisi par l’utilisateur (pas de calcul automatique) — pour V1.
  - `CHARNIERE`: toujours « charnière invisible » pour l’instant (pas d’UI spécifique).
  - `JAMBAGE`: ne pas modifier.
  - Pas d’ajout de nouveaux tokens sans gabarit mis à jour. MVP: `OUVERTURE_L` uniquement.

## 4) Stack et structure
- Vite + React + TypeScript (client-side uniquement).
- Structure recommandée:
  - `src/lib/svg.ts` — helpers pour parse, recherche de token, remplacement, sérialisation
  - `src/App.tsx` — UI (file input, champ valeur, actions, preview, zoom)
  - `src/index.css` — thème sombre minimal conforme à la spec

## 5) Algorithme (MVP)
1. Lire le fichier en string via `File.text()`.
2. `DOMParser().parseFromString(svgString, 'image/svg+xml')` → `Document`.
3. Sélectionner `document.getElementById('OUVERTURE_L')`.
4. Si le noeud contient des `<tspan>`, chercher le premier qui contient des chiffres; sinon modifier le `textContent` du `<text>`.
5. Remplacer uniquement la première occurrence numérique via regex.
6. Sérialiser `document.documentElement` via `XMLSerializer` pour l’aperçu et le téléchargement.

## 6) API utilitaires (TypeScript)
Créer `src/lib/svg.ts` avec ces fonctions:
```ts
export function parseSvg(svgText: string): Document {
  return new DOMParser().parseFromString(svgText, 'image/svg+xml')
}

export function serializeSvg(doc: Document): string {
  return new XMLSerializer().serializeToString(doc.documentElement)
}

export function findTokenNode(doc: Document, tokenId: string): SVGTextElement | null {
  return doc.getElementById(tokenId) as SVGTextElement | null
}

export function findFirstTspanWithDigits(node: SVGTextElement): Element | null {
  const tspans = Array.from(node.getElementsByTagName('tspan'))
  return tspans.find(t => /\d/.test(t.textContent ?? '')) ?? null
}

export function replaceFirstNumber(text: string, newNumber: string): string {
  const re = /(\d+(?:\.\d+)?)/ // point décimal
  if (!re.test(text)) return text
  return text.replace(re, newNumber)
}

export function applyNumericUpdate(doc: Document, tokenId: string, numericValue: string): boolean {
  const node = findTokenNode(doc, tokenId)
  if (!node) return false

  const target = findFirstTspanWithDigits(node) ?? node
  const current = (target.textContent ?? '')
  const next = replaceFirstNumber(current, numericValue.trim())
  target.textContent = next
  return true
}
```

## 7) Intégration UI minimale (extrait)
Dans `src/App.tsx`, appeler `applyNumericUpdate(doc, 'OUVERTURE_L', ouvertureL)`, puis rafraîchir l’aperçu avec `serializeSvg(doc)`.

```ts
import { useRef, useState } from 'react'
import { applyNumericUpdate, parseSvg, serializeSvg } from './lib/svg'

export default function App() {
  const [svgString, setSvgString] = useState('')
  const [ouvertureL, setOuvertureL] = useState('902')
  const [warning, setWarning] = useState('')
  const docRef = useRef<Document | null>(null)

  function onOpen(file: File) {
    file.text().then(text => {
      const doc = parseSvg(text)
      docRef.current = doc
      setSvgString(serializeSvg(doc))
      onApply()
    }).catch(() => setWarning('Erreur de lecture du fichier SVG.'))
  }

  function onApply() {
    const doc = docRef.current
    if (!doc) return
    const ok = applyNumericUpdate(doc, 'OUVERTURE_L', ouvertureL)
    if (!ok) setWarning('Token OUVERTURE_L introuvable.')
    setSvgString(serializeSvg(doc))
  }

  // ... file input / champs / boutons / preview
}
```

## 8) Tests manuels
- Charger un SVG contenant `id="OUVERTURE_L"` avec une valeur numérique visible.
- Saisir `930` puis appliquer → seul le nombre change, l’unité « mm » reste.
- Télécharger et rouvrir le SVG (ex.: Illustrator) → la même valeur est visible.
- Tester un SVG sans `OUVERTURE_L` → afficher l’avertissement discret.

## 9) Extensions V1 (pistes)
- Ajouter d’autres tokens (ex.: `CLOISON_E`, `JEU_LAT`, `JEU_HAUT`, `JEU_BAS`, `JAMBAGE_L`, `PORTE_E`, `PASSAGE_NET`).
- Conserver la même règle: modifier uniquement la partie numérique, sans toucher aux unités/texte.
- Pour des tokens non numériques (ex.: `MAIN`), prévoir un mapping textuel ou un visuel d’explication (hors MVP).
- Avertissement par token manquant; résumé de validation.

## 10) Gestion d’erreurs et robustesse
- Si `DOMParser` retourne un document invalide, remonter une erreur utilisateur.
- Si le token est trouvé mais aucun nombre n’est détecté, ne rien modifier (journaliser si nécessaire).
- Toujours travailler sur un `Document` temporaire en mémoire, puis sérialiser.

## 11) Performance et sécurité
- Le contenu reste local (aucun upload serveur).
- Utiliser `image/svg+xml` pour le parseur. Pas d’exécution de scripts inline.

## 12) Style UI
- Thème sombre DAO minimal, lisibilité élevée, contrastes conformes.
- Zoom via `transform: scale()` de l’aperçu, valeur 1.0 (100%) par défaut.

## 13) Scripts (si présents)
- `scripts/setup.ps1` — installe le squelette Vite React TS et dépendances.
- `scripts/dev.ps1` — lance le serveur de dev.
- `scripts/build.ps1` — build de production.

Ce guide décrit les points essentiels pour implémenter, tester et étendre la modification des cotations dans des fichiers SVG en gardant l’intégrité du gabarit et des unités.
