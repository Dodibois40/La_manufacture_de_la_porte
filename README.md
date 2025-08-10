# La_manufacture_de_la_porte

Application Vite + React + TypeScript pour modifier les cotations dans des fichiers SVG (texte uniquement), avec aperçu en direct et export.

## Démarrer en local
```powershell
# Préparer (Windows PowerShell)
.\scripts\setup.ps1

# Lancer le serveur
echo "Démarrer depuis plan2d"  # note
.\scripts\dev.ps1
```

## Build
```powershell
.\scripts\build.ps1
```
Le build est généré dans `plan2d/dist`.

## Déploiement Netlify
- Drag & drop: glisser `plan2d/dist` dans Netlify > Deploys
- CLI:
```powershell
cd plan2d
netlify deploy --dir=dist --prod
```

## Spécifications
Voir `Spécification de développement.md` et `Développement - Modification des cotations SVG.md`.
