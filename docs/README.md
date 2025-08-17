# La Manufacture de la Porte - Documentation

## 📁 Structure du Projet

```
La_manufacture_de_la_porte/
├── 📱 app/                    # Application React principale
│   ├── src/                   # Code source
│   │   ├── pages/            # Pages (Home, ConfigPage)
│   │   ├── components/       # Composants réutilisables
│   │   ├── styles/           # Styles CSS organisés
│   │   ├── utils/            # Fonctions utilitaires
│   │   ├── types/            # Types TypeScript
│   │   └── hooks/            # Hooks React personnalisés
│   ├── public/               # Assets publics
│   └── dist/                 # Build de production
├── 📚 docs/                  # Documentation
│   ├── design/               # Documentation design
│   └── development/          # Documentation technique
├── 🖼️ assets/               # Assets globaux
│   ├── images/              # Images (logos, photos)
│   ├── icons/               # Icônes
│   └── svg/                 # Fichiers SVG et samples
├── 🔧 scripts/              # Scripts PowerShell
└── Configuration (netlify.toml, etc.)
```

## 🚀 Commandes

### Développement
```powershell
# Démarrer le serveur de développement
.\scripts\dev.ps1

# Construire pour la production
.\scripts\build.ps1

# Pousser les changements sur Git
.\scripts\push.ps1 "message de commit"

# Setup initial du projet
.\scripts\setup.ps1
```

### Navigation
- **Page d'accueil**: `/` - Interface gaming avec menu interactif
- **Configurateur**: `/#config` - Outil de modification des cotations SVG

## 🎨 Styles

Les styles sont organisés en modules :
- `variables.css` - Variables CSS et couleurs (thème laiton granuleux)
- `globals.css` - Reset et styles globaux
- `components.css` - Styles des composants UI
- `pages.css` - Styles spécifiques aux pages

## 🔧 Technologies

- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styles**: CSS natif avec variables personnalisées
- **Déploiement**: Netlify
- **Scripts**: PowerShell

## 📖 Documentation

- [Design de la page d'accueil](./design/Design_Page_Accueil.md)
- [Modification des cotations SVG](./development/Développement%20-%20Modification%20des%20cotations%20SVG.md)
- [Lancement local](./development/Lancement%20local.md)
- [Spécifications de développement](./development/Spécification%20de%20développement.md)
