# Checklist de Test - Responsive Design

## Instruction de Test

Ouvrir le widget dans le navigateur et utiliser les DevTools (F12) pour tester à différentes tailles d'écran.

### Chrome/Edge DevTools
1. Ouvrir DevTools : F12 ou Ctrl+Shift+I
2. Cliquer sur l'icône "Toggle device toolbar" (Ctrl+Shift+M)
3. Sélectionner les appareils dans la liste déroulante ou entrer des dimensions personnalisées

### Firefox DevTools
1. Ouvrir DevTools : F12
2. Cliquer sur "Responsive Design Mode" (Ctrl+Shift+M)
3. Sélectionner les appareils ou entrer des dimensions personnalisées

## Tests par Breakpoint

### 1. Desktop (1024px+) - BASELINE
**Dimensions : 1920x1080**
- [ ] Controls en ligne horizontale (1 ligne, 4 éléments)
- [ ] Table avec taille normal (1.0x)
- [ ] Font size table : 16px
- [ ] Padding table : 20px
- [ ] Tous les contrôles visibles sans wrap
- [ ] Headers visibles et lisibles
- [ ] Données affichées correctement
- [ ] Mode plein écran fonctionne

### 2. Tablet (768-1023px)
**Dimensions : 1024x768, 768x1024 (portrait)**

#### Points de contrôle
- [ ] Controls commencent à wrapper (2 par ligne)
- [ ] Taille de colonne appliquée : 0.7x
- [ ] Font size : 14px
- [ ] Padding réduit : 12px
- [ ] Table scrollable horizontalement
- [ ] Headers sticky visibles lors du scroll
- [ ] Tous les éléments cliquables > 40px
- [ ] Pas de débordement horizontal du body

#### Landscape (1024x600)
- [ ] Padding réduit
- [ ] Table compacte
- [ ] Headers toujours visibles

### 3. Mobile (480-767px)
**Dimensions : 540x960, 480x800**

#### Contrôles
- [ ] Controls empilés sur 2 colonnes
- [ ] Chaque control width ~50% de l'écran
- [ ] Spacing correct entre contrôles
- [ ] Sélecteurs lisibles
- [ ] Cases à cocher tactiles (18px)

#### Table
- [ ] Taille colonne appliquée : 0.5x (50%)
- [ ] Font size body : 13px
- [ ] Font size table : 12px
- [ ] Padding table : 12px
- [ ] Padding cells : 10px
- [ ] Scroll horizontal activé
- [ ] Headers sticky au top
- [ ] Row headers sticky à gauche (z-index: 11)
- [ ] Données lisibles (min 12px)
- [ ] Hauteur minimale ligne : 32px

#### Contrôles Tactiles
- [ ] Boutons : min 44px height
- [ ] Checkboxes : 18px
- [ ] Sélecteurs : 44px height
- [ ] Espace entre éléments : 12px minimum

#### Filtres et Dropdowns
- [ ] Lisibles et accessibles
- [ ] Font size : 12px
- [ ] Padding : 10px

### 4. Petit Mobile (< 480px)
**Dimensions : 375x667 (iPhone), 360x640 (Android)**

#### Contrôles
- [ ] Controls empilés verticalement (1 par ligne)
- [ ] Width : 100% - padding
- [ ] Font size labels : 13px
- [ ] Font size inputs : 13px
- [ ] Height minimale boutons : 40px

#### Table
- [ ] Taille colonne appliquée : 0.4x (40%)
- [ ] Font size body : 11-12px
- [ ] Font size table : 10-11px
- [ ] Padding minimum : 8px table, 6px cells
- [ ] Scroll horizontal fluide
- [ ] Headers sticky parfaitement alignés
- [ ] Row headers sticky à gauche
- [ ] Données lisibles (min 10px)
- [ ] Min-width colonnes : 50px

#### Éléments Touchscreen
- [ ] Boutons : 40px minimum de hauteur
- [ ] Espacement : 8-10px
- [ ] Aucun débordement horizontal

#### Readability
- [ ] Texte lisible sans zoom
- [ ] Colonnes ne se chevauchent pas
- [ ] Valeurs distinctes les unes des autres

### 5. Très Petit Mobile (< 320px) - RARE
**Dimensions : 320x568 (iPhone SE)**

#### Extrême Compacité
- [ ] Controls empilés
- [ ] Font size : 9-11px
- [ ] Padding minimum : 4px
- [ ] Table scrollable
- [ ] Données toujours lisibles
- [ ] Pas de débordement

## Tests d'Orientation

### Portrait à Landscape
**À faire sur DevTools pour chaque taille mobile**

1. Ouvrir en portrait (ex: 375x667)
   - [ ] Toute l'interface adaptée
   - [ ] Responsive columns appliquées

2. Switcher en landscape (ex: 667x375)
   - [ ] Padding/margin réduits (< 500px hauteur)
   - [ ] Font sizes réduits en hauteur landscape
   - [ ] Scroll horizontal toujours présent
   - [ ] Table lisible

## Tests de Fonctionnalité

### Colonne Size Selector
- [ ] Sur Desktop : affiche 0.5x à 1.0x normal
- [ ] Sur Mobile : applique 0.5x par défaut
- [ ] Sur Petit Mobile : applique 0.4x par défaut
- [ ] Changement immédiat de taille
- [ ] Persistance après reload (localStorage)

### View Mode (Pivot / Fullscreen)
- [ ] Mode Pivot responsive sur tous les écrans
- [ ] Mode Fullscreen responsive
- [ ] Transition fluide entre modes
- [ ] Responsive columns appliquées en fullscreen
- [ ] Bouton exit plein écran accessible
- [ ] Position bouton exit adaptée au mobile (12px en bas à gauche)

### Subtotals (si activé)
- [ ] Visibles et lisibles sur mobile
- [ ] Font réduites avec le reste
- [ ] Padding adapté
- [ ] Scroll horizontal inclut les subtotals

### Fixed Width Mode
- [ ] Fonctionne sur tous les écrans
- [ ] Tableau inline-block adapté
- [ ] Scroll horizontal maintenu

### Drag & Drop
- [ ] Éléments draggables accessibles au mobile
- [ ] Pas trop petit pour être dragué
- [ ] Placeholder visuel clair

## Tests de Scroll

### Scroll Horizontal (< 768px)
1. Créer une table avec plusieurs colonnes
   - [ ] Scroll horizontal activé
   - [ ] `-webkit-overflow-scrolling: touch` actif (iOS)
   - [ ] Headers restent en haut lors du scroll horizontal
   - [ ] Row headers restent visibles à gauche

2. Tester sur mobile
   - [ ] Scroll smooth sur iOS
   - [ ] Aucun scroll vertical inutile
   - [ ] Données visibles en scrollant

### Scroll Vertical
- [ ] Scroll vertical normal fonctionne
- [ ] Pas de conflits avec scroll horizontal

## Tests de Performance

### Responsive Design
- [ ] Pas de lag lors du resize
- [ ] Debounce resize fonctionne (250ms)
- [ ] Changement d'orientation rapide
- [ ] Pas de flickering

### LocalStorage
- [ ] Préférence de taille de colonne sauvegardée
- [ ] Rechargement de la page restaure les préférences
- [ ] Mode fixe persistant

## Tests en Mode Sombre

Pour chaque breakpoint, tester le mode sombre (prefers-color-scheme: dark)

- [ ] Colors correctes
- [ ] Contrast sufficient (WCAG AA minimum)
- [ ] Headers visibles
- [ ] Données lisibles
- [ ] Contrôles accessibles

## Tests de Fenêtre Redimensionnement

1. Ouvrir à 1920px
   - [ ] Desktop layout
   - [ ] Taille 1.0x

2. Redimensionner progressivement vers 768px
   - [ ] Layout change à 1024px
   - [ ] Taille change à 0.7x
   - [ ] Aucun saut de style

3. Redimensionner progressivement vers 480px
   - [ ] Layout change à 768px
   - [ ] Taille change à 0.5x
   - [ ] Controls wrap à 2 colonnes
   - [ ] Headers sticky activés

4. Redimensionner vers < 480px
   - [ ] Taille change à 0.4x
   - [ ] Controls empilés verticalement
   - [ ] Aucune rupture d'interface

## Tests Surfaciques (Edge Cases)

### Petite Hauteur
- [ ] 1920x500 : mode landscape optimisé
- [ ] Contenu accessible sans scroll excessif
- [ ] Controls visibles

### Petite Largeur
- [ ] 320x960 : très petit mobile
- [ ] Toujours lisible
- [ ] Pas de débordement

### Haute Densité de Pixels
- [ ] 1080x1920 (mobile HD) : texte lisible
- [ ] 2560x1440 (desktop) : proportions correctes

## Validation d'Accessibilité

Pour chaque breakpoint, vérifier :

- [ ] Font size minimum 12px (sauf exceptionnel < 11px)
- [ ] Contrast ratio 4.5:1 pour texte normal (WCAG AA)
- [ ] Contrast ratio 3:1 pour éléments UI importants
- [ ] Éléments cliquables > 40px (recommandé) ou 36px (min)
- [ ] Spacing inter-éléments >= 8px

## Checklist Finale

- [ ] Tous les breakpoints testés
- [ ] Mode portrait ET landscape testés
- [ ] Mode sombre testé
- [ ] Scroll horizontal fonctionne
- [ ] Headers sticky fonctionnent
- [ ] Resize progressif sans erreur
- [ ] Orientation change sans erreur
- [ ] LocalStorage persistant
- [ ] Accessibility conforme WCAG AA
- [ ] Performance acceptable (no lag)

## Notes

- Utiliser Chrome DevTools pour tester sur les appareils de haute densité (Device Pixel Ratio)
- Tester avec différents zoom levels (75%, 100%, 125%)
- Vérifier sur de vrais appareils si possible (Android/iOS)
- Tester la perte de connection (réseau lent) pour voir le responsive loading
