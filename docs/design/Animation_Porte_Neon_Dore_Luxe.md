# 🚪✨ Animation Porte Néon Doré Luxe

## Description
Animation CSS pour une porte qui se dessine avec un effet néon doré luxueux. Cette animation crée un effet lumineux éclatant avec des ombres portées dorées intenses pour un rendu premium.

## Code CSS Complet

```css
/* Animation Porte Néon Doré Luxe */
.door-neon-container {
    width: 260px;
    height: 500px;
    position: relative;
}

.door-neon-container svg {
    filter: drop-shadow(0 0 15px rgba(218, 165, 32, 0.12));
    width: 100%;
    height: 100%;
}

.neon-line {
    stroke-dasharray: 3000;
    stroke-dashoffset: 3000;
    animation: neonDraw 5s ease-out forwards;
    stroke: #daa520;
    stroke-width: 1.2;
    fill: none;
    filter: drop-shadow(0 0 3px #ffd700) 
            drop-shadow(0 0 6px rgba(218, 165, 32, 0.5));
    opacity: 1;
}

@keyframes neonDraw {
    0% {
        stroke-dashoffset: 3000;
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    100% {
        stroke-dashoffset: 0;
        opacity: 1;
    }
}

/* Timing des animations */
.montant-left { animation-delay: 0s; }
.montant-right { animation-delay: 0.5s; }
.traverse-top { animation-delay: 1s; }
.door { animation-delay: 1.5s; }
.handle { 
    animation-delay: 2s; 
    stroke-width: 1.8;
    stroke: #daa520;
    filter: drop-shadow(0 0 3px #ffd700)
            drop-shadow(0 0 6px rgba(218, 165, 32, 0.5));
}

/* Pour animation en boucle (optionnel) */
.door-neon-container.loop .neon-line {
    animation: neonDraw 5s ease-out infinite;
}
```

## Caractéristiques

### 🎨 Couleurs Luxe
- **Stroke principal** : `#daa520` (or pur - DarkGoldenRod)
- **Poignée** : `#daa520` (même couleur pour uniformité)
- **Halo néon** : `#ffd700` (Gold) pour effet éclatant
- **Ombres** : rgba(218, 165, 32, 0.5) pour intensité

### ⚡ Effets Néon Premium
- **Drop-shadow renforcé** : 15px de rayon pour halo global
- **Double néon** : 3px + 6px pour effet de profondeur
- **Opacity** : 1 (pleine intensité)
- **Stroke-width** : 1.2px (lignes plus épaisses)
- **Poignée** : 1.8px (mise en valeur)

### ⏱️ Timing d'Animation
- **Montant gauche** : 0s
- **Montant droit** : 0.5s
- **Traverse haute** : 1s
- **Porte** : 1.5s
- **Poignée** : 2s (avec style renforcé)

### 🔄 Option Boucle
- **Classe `.loop`** : Animation infinie pour effet continu

## Utilisation
Cette animation peut être utilisée sur n'importe quelle page en appliquant la classe `.door-neon-container` au conteneur SVG et `.neon-line` aux éléments à animer.

## Version
Créé le : $(date)
Auteur : Dorian - La Manufacture de la Porte
