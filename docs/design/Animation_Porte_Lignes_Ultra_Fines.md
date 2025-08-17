# 🚪✨ Animation Porte - Lignes Ultra Fines

## Description
Animation CSS pour une porte qui se dessine avec des lignes ultra fines et élégantes. Cette animation privilégie la subtilité et la finesse avec un rendu minimaliste et raffiné.

## Code CSS Complet

```css
/* Animation Porte - Lignes Ultra Fines */
.door-container {
    width: 260px;
    height: 500px;
    position: relative;
}

.door-container svg {
    width: 100%;
    height: 100%;
}

.line-thin {
    stroke-dasharray: 3000;
    stroke-dashoffset: 3000;
    animation: drawLine 5s ease-out forwards;
    stroke: #d4af37;
    stroke-width: 0.3;
    fill: none;
    opacity: 1;
}

@keyframes drawLine {
    to {
        stroke-dashoffset: 0;
    }
}

/* Timing d'animation */
.montant-left { animation-delay: 0s; }
.montant-right { animation-delay: 0.5s; }
.traverse-top { animation-delay: 1s; }
.door { animation-delay: 1.5s; }
.handle { 
    animation-delay: 2s; 
    stroke-width: 0.5;
}

/* Pour animation en boucle (optionnel) */
.door-container.loop .line-thin {
    animation: drawLine 5s ease-out infinite;
}
```

## Caractéristiques

### 🎨 Couleur Élégante
- **Stroke principal** : `#d4af37` (or élégant)
- **Poignée** : Même couleur pour uniformité
- **Pas d'effets** : Simplicité pure

### ⚡ Lignes Ultra Fines
- **Stroke-width principal** : 0.3px (ultra fin)
- **Poignée** : 0.5px (légèrement plus visible)
- **Pas de drop-shadow** : Rendu épuré
- **Opacity** : 1 (visibilité parfaite malgré finesse)

### ⏱️ Timing d'Animation
- **Montant gauche** : 0s
- **Montant droit** : 0.5s
- **Traverse haute** : 1s
- **Porte** : 1.5s
- **Poignée** : 2s

### 🎯 Philosophie Design
- **Minimalisme** : Lignes fines et élégantes
- **Subtilité** : Animation discrète mais captivante
- **Raffinement** : Esthétique épurée et moderne

### 🔄 Option Boucle
- **Classe `.loop`** : Animation infinie pour effet continu

## Utilisation
Cette animation peut être utilisée sur n'importe quelle page en appliquant la classe `.door-neon-container` au conteneur SVG et `.neon-line` aux éléments à animer.

## Version
Créé le : $(date)
Auteur : Dorian - La Manufacture de la Porte
