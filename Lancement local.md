# Lancement en local — Guide rapide

## 1) Prérequis
- Windows 10 ou supérieur, PowerShell 5.1+
- Node.js LTS installé (télécharger depuis https://nodejs.org/)

## 2) Ouvrir un terminal au bon endroit
- Ouvrir PowerShell dans le dossier racine du projet (ex.: `C:\Users\doria\Desktop\La_manufacture_de_la_porte`).

## 3) Préparer le projet (une seule fois)
Si c’est la première exécution sur cette machine:

```powershell
# Autoriser l'exécution des scripts pour cette session uniquement
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Lancer le script de préparation (installe Vite + React + TypeScript et dépendances)
.\scripts\setup.ps1
```

Le script crée une application Vite nommée `plan2d` et installe les dépendances.

## 4) Démarrer le serveur de développement
```powershell
.\scripts\dev.ps1
```
- Ouvrir le navigateur à l’adresse: http://localhost:5173

## 5) Utilisation de l’application
- Bouton « Ouvrir SVG »: sélectionner un fichier `.svg` provenant d’Illustrator/LayOut avec les IDs de texte (ex. `OUVERTURE_L`).
- Champ « Ouverture L (mm) »: saisir une valeur (décimale avec un point, ex. `930` ou `69.5`).
- Bouton « Appliquer » (ou sortir du champ) met à jour uniquement les chiffres de la cotation.
- Bouton « Télécharger SVG »: enregistre le SVG modifié localement.
- Zoom: boutons − / + (100% par défaut), sans altérer le fichier.

Notes et limites:
- Aucune géométrie n’est recalculée; seuls les chiffres des cotations sont modifiés.
- MVP: seul le token `OUVERTURE_L` est pris en compte.
- Si le token est introuvable dans le SVG, un avertissement discret est affiché.
- L’unité « mm » présente dans le gabarit n’est pas dupliquée (on remplace uniquement la valeur numérique).

## 6) Build de production
```powershell
.\scripts\build.ps1
```
- Le build est généré dans `plan2d\dist`. Ouvrez `index.html` avec un serveur statique si nécessaire.

## 7) Dépannage
- « running scripts is disabled on this system »:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
- `npm` ou `node` introuvable: installer Node.js LTS (puis rouvrir PowerShell).
- Port déjà utilisé (5173): fermer l’autre service ou redémarrer la machine.

## 8) Structure générée (à titre indicatif)
- `scripts\setup.ps1` — installe et prépare l’app `plan2d`
- `scripts\dev.ps1` — lance le serveur de dev (Vite)
- `scripts\build.ps1` — produit le build de production
- `plan2d\src\App.tsx` — logique d’édition de la valeur `OUVERTURE_L`
- `plan2d\src\index.css` — thème sombre minimal

Si les scripts n’existent pas encore, demandez leur création ou exécutez la préparation du projet manuellement (via `npm create vite@latest`), puis reportez-vous aux sections ci-dessus.
