# Responsive Design - Documentation Technique

## Vue d'ensemble

Le widget Tableau Croisé Dynamique a été amélioré pour fonctionner de manière optimale sur tous les appareils, des petits téléphones (320px) aux écrans de bureau (1920px+).

## Breakpoints Media Queries

Le design utilise 4 breakpoints principaux :

### 1. Desktop (1024px et plus)
- Largeur normale des colonnes (100%)
- Polices de grande taille (16px)
- Padding/Margin régulier
- Tous les contrôles visibles

### 2. Tablet (768px à 1023px)
- Largeur des colonnes réduite (70%)
- Polices réduites (14px)
- Padding réduit
- Controls empilés partiellement

### 3. Mobile (480px à 767px)
- Largeur des colonnes compacte (50%)
- Polices petites (13px pour le body)
- Padding minimal
- Controls empilés verticalement (2 par ligne)
- Scroll horizontal avec `-webkit-overflow-scrolling: touch`
- Headers sticky pour scroll horizontal

### 4. Mobile petit (< 480px)
- Largeur des colonnes ultra-compacte (40%)
- Polices très réduites (10-11px)
- Padding minimal (6-8px)
- Controls empilés verticalement (1 par ligne)
- Taille de police minimum respectée (min 10px)
- Boutons au moins 40px de hauteur pour tactile

### 5. Écrans très petits (< 320px)
- Taille extrêmement compacte
- Polices réduites à 9-10px
- Padding minimal (4px)

### 6. Mode Landscape (hauteur < 500px)
- Padding et marges réduites
- Compact même sur les écrans larges

## Fonctionnalités Principales

### Sticky Headers
- En-têtes des colonnes restent visibles lors du scroll horizontal
- En-têtes des lignes (th) restent visibles à gauche avec z-index: 11

### Optimisations CSS
```css
/* Scroll horizontal avec momentum sur iOS */
overflow-x: auto;
-webkit-overflow-scrolling: touch;

/* Headers sticky */
position: sticky;
top: 0; /* ou left: 0 pour les headers de ligne */
z-index: 10; /* ou 11 pour les headers de ligne */
```

### Responsive JavaScript

Le fichier `index.js` contient plusieurs fonctions de gestion du responsive :

#### `getScreenSize()`
Retourne la catégorie de taille d'écran :
- `'mobile-small'` : < 480px
- `'mobile'` : 480px - 767px
- `'tablet'` : 768px - 1023px
- `'desktop'` : 1024px+

#### `applyResponsiveColumnSize()`
Applique automatiquement la taille de colonne idéale selon la taille d'écran :
- Mobile petit : 0.4x (très compact)
- Mobile : 0.5x (compact)
- Tablet : 0.7x (moyennement compact)
- Desktop : 1.0x (normal)

Ne force pas la taille si l'utilisateur a explicitement choisi une autre taille.

#### `optimizeTableForMobile()`
Optimise les headers sticky sur les petits écrans.

#### `initResponsiveDesign()`
Initialise les gestionnaires d'événements :
- `orientationchange` : applique les optimisations lors du changement d'orientation
- `resize` : applique les optimisations avec debounce (250ms)

### Responsive Controls

Les contrôles (sélecteurs, cases à cocher) s'adaptent à la taille de l'écran :

- **Desktop** : Alignement horizontal, gap 20px
- **Tablet/Mobile** : Flex wrap, 2 par ligne
- **Petit Mobile** : 1 par ligne, 100% width

### Touch-Friendly Sizing

Tous les éléments cliquables respectent les normes d'accessibilité tactile :
- Boutons : min-height 40-44px
- Cases à cocher : 18-20px
- Padding minimum : 8-10px

## Styles de Table

### Tailles de Police par Écran
- Desktop : 16px (body), 14px (contrôles)
- Tablet : 14px (body)
- Mobile : 13px (body), 12px (controls)
- Petit Mobile : 11-12px (body), 10px (table)
- Très petit : 9-10px

### Padding par Écran
- Desktop : 20px (table), 16px (cells), 14px (td)
- Tablet : 12px (table), 10px (cells)
- Mobile : 12px (table), 10px (cells)
- Petit Mobile : 8px (table), 6px (cells)
- Très petit : 4px minimum

### Hauteur Minimale des Lignes
- Desktop/Tablet : normal
- Mobile : 32px minimum (pour tactile)
- Petit Mobile : 32-40px minimum

## Variables CSS Utilisées

```css
--table-header-bg: #f8fafc;
--table-header-text: #64748b;
--table-border: #e2e8f0;
--table-hover: #f1f5f9;
```

Ces variables s'adaptent automatiquement en mode sombre.

## Tailles de Test Recommandées

### Tests Basiques
- 320x568 : iPhone SE
- 375x667 : iPhone 8/X
- 480x800 : Samsung S5
- 768x1024 : iPad
- 1024x768 : iPad Landscape
- 1920x1080 : Desktop HD

### Tests Complets (Chrome DevTools)
1. **Mobile Small** (< 480px)
   - 360x640 (Android)
   - 375x667 (iPhone)
   - 320x568 (Petit)

2. **Mobile** (480-767px)
   - 480x800
   - 540x960

3. **Tablet** (768-1023px)
   - 768x1024
   - 800x600

4. **Desktop** (1024px+)
   - 1280x720
   - 1920x1080
   - 2560x1440

### Tests d'Orientation
- Portrait : hauteur > largeur
- Landscape : hauteur < largeur (< 500px)

## Éléments Optimisés

### Table
- ✓ Scroll horizontal
- ✓ Headers sticky
- ✓ Font responsive
- ✓ Padding responsive
- ✓ Min-width sur colonnes

### Controls (sélecteurs, boutons)
- ✓ Flex wrap
- ✓ Touch-friendly sizing
- ✓ Font responsive
- ✓ Responsivité horizontale/verticale

### Drag & Drop
- ✓ Font reduced
- ✓ Padding reduced
- ✓ Spacing optimized

### Filtres
- ✓ Border-radius responsive
- ✓ Padding responsive
- ✓ Font responsive

## Performance

Les optimisations incluent :
- Debounce sur resize (250ms)
- LocalStorage pour les préférences utilisateur
- CSS uniquement pour les media queries (pas de JS lourd)
- Z-index gestion pour sticky headers

## Compatibilité Navigateurs

- ✓ Chrome/Edge 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ iOS Safari (momentum scroll)
- ✓ Android Chrome

## LocalStorage Utilisé

```javascript
'columnSizePreference' // Taille de colonne sélectionnée
'fixedWidthMode'       // Mode largeur fixe
```

## État Persisté dans Grist

```javascript
'settings'             // Config du tableau (rows, cols, vals)
'columnSize'           // Taille de colonnes
'viewMode'             // Mode d'affichage (pivot/fullscreen)
'subtotalsEnabled'     // État des sous-totaux
'fixedWidthMode'       // Mode largeur fixe
```

## Notes de Développement

1. Les media queries utilisent `max-width` pour mobile-first cascade
2. Les variables CSS permettent l'adaptation automatique en mode sombre
3. Le debounce sur resize évite les appels répétés pendant le redimensionnement
4. Les sticky headers utilisent z-index stratégiques pour éviter les chevauches
5. Les transitions CSS sont désactivées sur mobile pour la performance

## Améliorations Futures

- Support du responsive en mode fullscreen optimisé
- Animation de scroll horizontal sur petits écrans
- Adaptation dynamique de la nombre de colonnes affichées
- Mode "compact" ultra-réduit pour très petits écrans
- Swipe horizontal pour navigation entre colonnes
