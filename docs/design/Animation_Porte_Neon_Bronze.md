# 🚪✨ Animation Porte Néon Bronze

## Description
Animation CSS pour une porte qui se dessine avec un effet néon bronze/laiton. Cette animation crée un effet lumineux subtil avec des ombres portées dorées.

## Code CSS Complet

```css
/* Animation Porte Néon Bronze */
.door-neon-container {
    width: 260px;
    height: 500px;
    position: relative;
}

.door-neon-container svg {
    filter: drop-shadow(0 0 8px rgba(201, 169, 97, 0.08));
    width: 100%;
    height: 100%;
}

.neon-line {
    stroke-dasharray: 3000;
    stroke-dashoffset: 3000;
    animation: neonDraw 5s ease-out forwards;
    stroke: #c9a961;
    stroke-width: 1;
    fill: none;
    filter: drop-shadow(0 0 2px #ddb678) 
            drop-shadow(0 0 4px rgba(184, 134, 11, 0.4));
    opacity: 0.95;
}

@keyframes neonDraw {
    0% {
        stroke-dashoffset: 3000;
        opacity: 0;
    }
    10% {
        opacity: 0.95;
    }
    100% {
        stroke-dashoffset: 0;
        opacity: 0.95;
    }
}

.montant-left { animation-delay: 0s; }
.montant-right { animation-delay: 0.5s; }
.traverse-top { animation-delay: 1s; }
.door { animation-delay: 1.5s; }
.handle { 
    animation-delay: 2s; 
    stroke-width: 1.5;
    stroke: #ddb678;
    filter: drop-shadow(0 0 2px #ddb678)
            drop-shadow(0 0 4px rgba(184, 134, 11, 0.4));
}
```

## Caractéristiques

### 🎨 Couleurs
- **Stroke principal** : `#c9a961` (bronze/laiton)
- **Poignée** : `#ddb678` (laiton plus clair)
- **Ombres** : Dégradé de bronze avec transparence

### ⚡ Effets Néon
- **Drop-shadow multiple** : Effet de halo lumineux
- **Opacity** : 0.95 pour un effet subtil
- **Animation** : 5 secondes avec ease-out

### ⏱️ Timing d'Animation
- **Montant gauche** : 0s
- **Montant droit** : 0.5s
- **Traverse haute** : 1s
- **Porte** : 1.5s
- **Poignée** : 2s (avec style spécial)

## Utilisation
Cette animation peut être utilisée sur n'importe quelle page en appliquant la classe `.door-neon-container` au conteneur SVG et `.neon-line` aux éléments à animer.

## Version
Créé le : $(date)
Auteur : Dorian - La Manufacture de la Porte
