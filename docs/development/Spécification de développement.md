# Plan 2D éditable – **Spécification de développement (Markdown)**

## 0) Objectif

Créer une page web (client seul) qui charge un **gabarit SVG** (export Illustrator/LayOut), **remplace uniquement les textes de cotations** identifiés par des *tokens* (IDs), affiche l’aperçu et permet de **télécharger le SVG** modifié. **Aucune géométrie n’est recalculée.**

---

## 1) Portée MVP (Essai)

* Charger un SVG depuis le disque.
* Remplacer **un seul token** : `OUVERTURE_L` par la valeur saisie (ex. `930 mm`).
* Aperçu en direct + bouton **Télécharger SVG**.

### V1 (après essai OK)

* Tokens supplémentaires : `CLOISON_E`, `JEU_LAT`, `JEU_HAUT`, `JEU_BAS`, `JAMBAGE_L`, `PORTE_E`, `PASSAGE_NET`, `MAIN`, `CHARNIERE`.
* Champs d’entrée correspondants (voir §4).
* Avertir si un token est manquant dans le SVG.

---

## 2) Conventions de gabarit SVG (à respecter côté Illustrator)

* Chaque valeur modifiable est un  (pas vectorisé), nommée via **id** unique.
* Export SVG Illustrator :

  * Stylisation = **CSS interne**
  * Police = **SVG** (ne pas convertir en contours)
  * Images = **Intégrer** (si textures), sinon Conserver
  * ID objet = **Noms de calque/objet**
  * Décimales = 2–3, Minifier ✔, Responsive ✔
* Exemple attendu :

  ```xml
  <text id="OUVERTURE_L" class="cls-4" transform="translate(681 513)">902 mm</text>
  ```
* Alignement conseillé : **centré** (ou `text-anchor="middle"`) pour éviter le “glissement” visuel.

---

## 3) Stack technique

* **Vite + React + TypeScript** (client-side only).
* Aucune lib externe obligatoire.
* Pan/zoom simple facultatif (si utile à l’aperçu).

---

## 4) UI/UX

* **Bouton** « Ouvrir SVG » (`<input type="file" accept="image/svg+xml">`).
* **Champ nombre** « Ouverture L (mm) » (défaut `902`).
* **Aperçu** : injecter le `<svg>` **inline** dans le DOM (pas via `<img>`).
* **Bouton** « Télécharger SVG » : export du DOM `<svg>` modifié (nom : `plan_modifie.svg`).

*(V1)* Ajouter les champs :

* Ouverture H (mm), Épaisseur cloison (mm)
* Jeux : latéral, haut, bas (mm)
* Jambage (mm), Épaisseur porte (mm)
* Main (select: « poussant gauche/droite »), Charnière (toggle: « invisible/paumelles »)

---

## 5) Tokens & mapping (IDs → affichage)

* `OUVERTURE_L` → `${valeur} mm`
* `CLOISON_E` → `${valeur} mm`
* `JEU_LAT` → `${valeur} mm`
* `JEU_HAUT` → `${valeur} mm`
* `JEU_BAS` → `${valeur} mm`
* `JAMBAGE_L` → `${valeur} mm`
* `PORTE_E` → `${valeur} mm`
* `PASSAGE_NET` → `${valeur} mm` (si fourni)
* `MAIN` → `poussant gauche` | `poussant droite`
* `CHARNIERE` → `charnière invisible` | `paumelles`

**Règles d’affichage**

* Suffixe `mm`. Autoriser une décimale si l’input contient `69.5` → afficher `69.5 mm`.
* Ne jamais ajouter d’espace ou d’unités si le gabarit inclut déjà « mm » dans le texte. (Dans ce cas, écrire seulement la valeur.)

---

## 6) Algorithme (MVP – un token)

1. Lire fichier en string.
2. `DOMParser` → `document`.
3. Sélectionner `const n = document.getElementById('OUVERTURE_L')`.
4. Si le noeud contient des `<tspan>`, mettre à jour `textContent` du **premier** `<tspan>`, sinon celui du `<text>`.
5. Sérialiser avec `XMLSerializer` pour le **téléchargement**.

### Gestion des cas particuliers

* **Token introuvable** → afficher un message discret : « OUVERTURE\_L manquant ».
* \*\*Plusieurs \*\*\`\` → concaténer, remplace tout le contenu par une seule valeur.
* **Transform** sur `<text>` → ne pas toucher (on remplace seulement le texte).

---

## 7) Pseudocode

```ts
state: ouvertureL = 902
svgDoc: Document | null = null

onOpenFile(file):
  text = await file.text()
  svgDoc = new DOMParser().parseFromString(text, 'image/svg+xml')
  renderInline(svgDoc.documentElement)
  apply()

apply():
  if (!svgDoc) return
  const node = svgDoc.getElementById('OUVERTURE_L') as SVGTextElement | null
  if (!node) { showWarning('Token OUVERTURE_L introuvable') ; return }
  const txt = formatMm(ouvertureL)
  const tspans = node.getElementsByTagName('tspan')
  if (tspans.length) tspans[0].textContent = txt
  else node.textContent = txt
  refreshInline()

download():
  const s = new XMLSerializer().serializeToString(svgDoc!)
  saveAsBlob(s, 'plan_modifie.svg')

formatMm(v:number): string => `${v} mm`
```

---

## 8) Tests manuels (MVP)

1. Ouvrir un SVG contenant `<text id="OUVERTURE_L">902 mm</text>`.
2. Saisir `930` → l’aperçu montre **930 mm**.
3. Télécharger → rouvrir dans Illustrator → la cote lit **930 mm**.

*(V1)* Vérifier chaque token + message « manquant » si l’ID n’existe pas.

---

## 9) Checklist Illustrator (rappel)

* Texte **non vectorisé**, objet  (icône T).
* Renommer l’objet texte en **ID** (ex. `OUVERTURE_L`).
* Alignement **centré** recommandé.
* Export avec **Police = SVG**, **ID objet = Noms de calque/objet**.

---

## 10) Backlog (après V1)

* Export **PNG/PDF** (rendu canvas → PNG → PDF simple A4).
* Multi-modèles (poussant G/D) sélectionné par un menu.
* Variables cartouche : `CLIENT`, `PROJET`, `DATE`, `ECHELLE`.
* Bibliothèque de gabarits (stockage DB + aperçu).

## 11) Charte UI sombre (style « logiciel de DAO »)

**Nom du site** : *La Manufacture de la porte intérieur*

**Logo** :

* URL : `https://firebasestorage.googleapis.com/v0/b/site-web-commande-panneaux.firebasestorage.app/o/Logo%2FSans-titre---2-%5BR%C3%A9cup%C3%A9r%C3%A9%5D.png?alt=media&token=857a8d48-d4a3-4533-86a5-2d62067b963e`
* Emplacement : en **haut-gauche** d’un header sombre (48–56 px de haut).
* Si le logo est sombre, prévoir une version claire (ou `filter: invert(1)` temporaire).

### Couleurs

* **Fond principal** : `#1A1A1A`
* **Surfaces/panneaux** : `#333333`
* **Texte principal** : `#EAEAEA`
* **Texte secondaire** : `#A0A0A0`
* **Traits techniques** : `#BFBFBF`
* **Cotes (accent)** : `lime` (ou `#98FF66`)

### Typographie (style terminal)

* Famille : `"JetBrains Mono", "IBM Plex Mono", "Fira Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
* Poids : 400/500 ; interlignage 1.2–1.3

### Épaisseurs de traits

* Géométrie : 1 px
* Grille : 0.5 px
* Cotes (lignes/repères) : 1 px ; flèches 6–8 px
* Bordures UI : 1 px `#444`

### Layout

* **Header** `#1A1A1A` avec logo + titre.
* **Panneau latéral** `#333333` pour les champs.
* **Aire d’aperçu** fond `#1A1A1A`.
* Grille d’espacement : 8 px.

### Rendu SVG

* On ne modifie que le **texte**.
* Lignes techniques : stroke `#BFBFBF`, linecap/linejoin `round`.
* Cotes (texte) : `lime` (taille 14–16 px selon échelle).
* Cotes (lignes) : stroke `#9E9E9E`.
* `text-anchor="middle"` recommandé pour les valeurs centrées.

### Accessibilité

* Contraste ≥ 4.5:1 ; états `:hover`/`:focus` visibles (bordure 1 px `#A3FF5A`).
* Curseur croix sur l’aperçu, pointeur standard sur l’UI.

### Tokens (rappel)

* IDs en MAJUSCULE sans espaces : `OUVERTURE_L`, `CLOISON_E`, `JAMBAGE_L`, etc. (pas d’accents).

### Branding

* Favicon monochrome (blanc sur `#1A1A1A`).
* Versions logo clair/sombre.
* Captures de référence pour valider les contrastes avant intégration.
