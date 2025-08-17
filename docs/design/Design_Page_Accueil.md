# Design de la Page d'Accueil - La Manufacture de la Porte

## 📋 Plan de Développement

### Phase 1 : Analyse et Planification
- [ ] Comprendre la vision du client pour la page d'accueil
- [ ] Définir la structure générale de la page
- [ ] Choisir la palette de couleurs
- [ ] Sélectionner les polices
- [ ] Planifier la mise en page (layout)

### Phase 2 : Éléments Visuels
- [ ] Définir le style des boutons
- [ ] Concevoir les fenêtres/modales
- [ ] Créer les composants de navigation
- [ ] Définir les espacements et marges

### Phase 3 : Implémentation
- [ ] Mise à jour du CSS principal
- [ ] Modification du composant Home.tsx
- [ ] Tests et ajustements

## 🎨 Éléments à Définir

### Couleurs
- Couleur principale : 
- Couleur secondaire :
- Couleur d'accent : #3A6FD0 (bleu foncé - préférence établie)
- Couleurs de fond :
- Couleurs de texte :

### Polices
- Police principale (titres) :
- Police secondaire (texte) :
- Tailles de police :

### Layout/Mise en page
- Structure générale :
- Disposition des sections :
- Responsive design :

### Composants UI
- Style des boutons :
- Style des fenêtres/modales :
- Navigation :
- Formulaires :

## 🎯 Brief Client - Vision Définie

### Objectif
Vendre des blocs portes en bois sur mesure configurables

### Public Cible
Professionnels : architectes, promoteurs, artisans

### Concept Principal
**Page d'accueil immersive type "jeu vidéo"**
- Fond d'écran pleine page
- Menu futuriste et discret
- Interactions dynamiques avec sons
- Design hors du commun, pas "site web classique"

### Style Visuel
- **Moderne et sobre**
- **Minimaliste**
- **Lignes très fines style dessin industriel**
- **Couleurs sombres** : noir-gris très foncé (pas noir pur)
- **Accent** : #3A6FD0 (bleu foncé)

### Message Clé
Fabrication artisanale française au Pays Basque (64)
Configuration et commande en ligne

## 🎨 Propositions de Slogans

### Option 1 - Artisanal & Moderne
**"Portes sur mesure, savoir-faire basque"**

### Option 2 - Technologie & Tradition  
**"Configurez votre porte, nous la façonnons"**

### Option 3 - Élégant & Direct
**"L'art de la porte, made in Pays Basque"**

### Option 4 - Innovation & Terroir
**"Portes d'exception, configurables en ligne"**

### Option 5 - Poétique & Technique
**"Chaque porte raconte votre histoire"**

## ✅ Décisions Finales

### Slogan Choisi
**"Configurez votre porte, nous la façonnons"**

### Interface Gaming Définie
- **Menu** : Apparaît au survol du logo ✅
- **Effets** : Parallaxe sur le fond ✅
- **Animations** : Légères et fluides ✅
- **CTA Principal** : "Configurer ma porte" au centre ✅
- **Style** : Élégance industrielle sombre ✅

## 🎮 Fonctionnalités Implémentées

### ✅ Structure Gaming
- Page plein écran immersive
- Logo flottant avec animation
- Menu contextuel au survol
- Interface centrale minimaliste

### ✅ Effets Visuels
- Fond parallaxe réactif à la souris
- Animations CSS fluides (float, glow)
- Transitions smooth (0.3s)
- Effets de hover interactifs

### 🎨 Options Couleurs Premium

#### Option 1 - Bronze Texturé
- **Principal** : `#CD7F32` (bronze classique)
- **Glow** : `rgba(205, 127, 50, 0.3)`
- **Accent clair** : `#E6A85C` (bronze doré)

#### Option 2 - Or Texturé  
- **Principal** : `#D4AF37` (or antique)
- **Glow** : `rgba(212, 175, 55, 0.3)`
- **Accent clair** : `#F4D03F` (or brillant)

### ✅ Design System Bronze Implémenté
- **Couleurs gaming** : #1a1a1a + #CD7F32 (bronze) ✅
- **Accent clair** : #E6A85C (bronze doré) ✅
- **Effets glow** : rgba(205, 127, 50, 0.3) ✅
- **Shimmer** : rgba(230, 168, 92, 0.2) ✅
- **Logo officiel** : Intégré avec effets bronze ✅
- Typographie moderne (Plus Jakarta Sans)
- Bouton CTA avec effet glow bronze
- Badges flottants stylisés

### 🎨 Logo Intégré
- **Format** : SVG optimisé
- **Couleur** : Bronze #CD7F32
- **Effets** : Drop-shadow bronze + glow au survol
- **Taille** : 40x40px avec scale 1.1 au hover
- **Animation** : Transition fluide 0.3s

### ✨ Texture Bronze Artisanale Ajoutée
- **Gradients multicouches** : #B8722C → #CD7F32 → #E6A85C
- **Effets de grain** : Radial gradients superposés
- **Texte accent** : Background-clip avec texture
- **Bouton CTA** : Bordure texturée + fond multicouche
- **Logo** : Multiple drop-shadows pour effet métallique
- **Badges** : Overlay bronze au hover
- **Profondeur visuelle** : Ombres et reflets authentiques

### ✅ Responsive Design
- Adaptation mobile/tablette
- Menu optimisé pour touch
- Tailles de police adaptatives

## 🎨 Spécifications Techniques

### Structure de Page
```
[Logo] (menu au survol)
     |
[Fond Parallaxe Pleine Page]
     |
[Zone Centrale]
- Slogan principal
- Bouton "Configurer ma porte"
- Sous-titre Pays Basque
```

### Couleurs Définitives
- **Fond principal** : #1a1a1a (noir-gris très foncé)
- **Accent** : #3A6FD0 (bleu foncé)
- **Texte** : #f5f5f5 (blanc cassé)
- **Lignes/Bordures** : #333333 (gris foncé)

### Effets Interactifs
- Menu slide-in au survol logo
- Parallaxe subtil sur fond
- Glow effect sur bouton principal
- Transitions smooth (0.3s ease)

---
*Document créé le : $(Get-Date)*
