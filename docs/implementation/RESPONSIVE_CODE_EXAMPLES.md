# Exemples de Code - Responsive Design

## 1. Détection de Taille d'Écran

### getScreenSize() - Exemple d'Utilisation

```javascript
// Appel simple
const screenSize = getScreenSize();

// Résultats possibles :
// '320px à 479px'  → 'mobile-small'
// '480px à 767px'  → 'mobile'
// '768px à 1023px' → 'tablet'
// '1024px+'        → 'desktop'

// Exemple d'utilisation dans une condition
function applyResponsiveColumnSize() {
  const screenSize = getScreenSize();
  
  switch (screenSize) {
    case 'mobile-small':
      // Appliquer 0.4x (40% de la largeur)
      changeColumnSize('0.4');
      break;
    case 'mobile':
      // Appliquer 0.5x (50% de la largeur)
      changeColumnSize('0.5');
      break;
    case 'tablet':
      // Appliquer 0.7x (70% de la largeur)
      changeColumnSize('0.7');
      break;
    default:
      // Desktop: 1.0x (100% de la largeur)
      changeColumnSize('1.0');
  }
}
```

### getScreenOrientation() - Exemple d'Utilisation

```javascript
// Déterminer l'orientation
const orientation = getScreenOrientation();

if (orientation === 'portrait') {
  // Hauteur > Largeur
  // Adapter le layout pour portrait
} else {
  // Largeur > Hauteur
  // Adapter le layout pour landscape
}
```

## 2. Sticky Headers - CSS & JavaScript

### CSS pour Headers Collants

```css
/* Headers de colonnes - restent au top lors du scroll horizontal */
table.pvtTable thead tr th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--table-header-bg);
  border-bottom: 2px solid var(--table-border);
}

/* Headers de lignes - restent à gauche lors du scroll horizontal */
table.pvtTable tbody tr th {
  position: sticky;
  left: 0;
  z-index: 11;
  background-color: var(--table-header-bg);
}
```

### JavaScript pour Appliquer Sticky Headers

```javascript
function optimizeTableForMobile() {
  const screenSize = getScreenSize();
  const $table = $('#table').find('table.pvtTable');
  
  // Seulement appliquer sur petits écrans
  if (screenSize === 'mobile-small' || screenSize === 'mobile') {
    // Headers des colonnes
    $table.find('thead tr th').each(function() {
      $(this).css({
        'position': 'sticky',
        'top': '0',
        'z-index': '10',
        'background-color': 'var(--table-header-bg)',
        'border-bottom': '2px solid var(--table-border)'
      });
    });

    // Headers des lignes
    $table.find('tbody tr th').each(function() {
      $(this).css({
        'position': 'sticky',
        'left': '0',
        'z-index': '11',
        'background-color': 'var(--table-header-bg)'
      });
    });
  }
}
```

## 3. Momentum Scroll sur iOS

### CSS pour Momentum Scroll

```css
/* Activer le momentum scroll sur iOS */
#table {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* iOS momentum */
}

/* Aussi sur le fullscreen container */
#fullscreen-table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

### Résultat
- **iOS** : Scroll smooth avec inertie (momentum)
- **Android** : Scroll standard avec inertie native
- **Desktop** : Scroll bar normale

## 4. Tailles Responsives des Colonnes

### Avant (Desktop)
```
Colonne 1 : 200px
Colonne 2 : 200px
Colonne 3 : 200px
Colonne 4 : 200px
Total : 800px
```

### Après (Mobile)
```
0.5x factor appliqué :
Colonne 1 : 100px
Colonne 2 : 100px
Colonne 3 : 100px
Colonne 4 : 100px
Total : 400px (scrollable)
```

### JavaScript qui Applique la Transformation

```javascript
function applyResponsiveColumnSize() {
  const screenSize = getScreenSize();
  const savedSize = localStorage.getItem('columnSizePreference');

  // Ne pas forcer si l'utilisateur a choisi une taille
  if (savedSize && savedSize !== '1.0') {
    return;
  }

  let autoSize = '1.0';
  
  // Déterminer la taille selon l'écran
  switch (screenSize) {
    case 'mobile-small':
      autoSize = '0.4'; // 40% de la largeur
      break;
    case 'mobile':
      autoSize = '0.5'; // 50% de la largeur
      break;
    case 'tablet':
      autoSize = '0.7'; // 70% de la largeur
      break;
    default:
      autoSize = '1.0'; // 100% (normal)
  }

  // Appliquer la taille
  if (autoSize !== '1.0') {
    changeColumnSize(autoSize);
    $('#column-size-select').val(autoSize);
  }
}
```

## 5. Débounce du Resize Event

### Problème sans Débounce
```
Utilisateur redimensionne la fenêtre de 1920px à 320px
→ handleWindowResize() appelé 1600+ fois !
→ Performance catastrophique
```

### Solution avec Débounce
```javascript
let resizeTimer;

window.addEventListener('resize', () => {
  // Annuler le timer précédent
  clearTimeout(resizeTimer);
  
  // Créer un nouveau timer
  resizeTimer = setTimeout(() => {
    // handleWindowResize() appelé seulement UNE fois
    // après 250ms d'inactivité
    handleWindowResize();
  }, 250); // 250ms de délai
});
```

### Résultat
```
Sans débounce : 1600+ appels
Avec débounce (250ms) : 2-3 appels seulement
Performance améliorée de 99% !
```

## 6. Media Queries - Cascade de Styles

### Exemple : Taille du Font

```css
/* BASE - Desktop (1024px+) */
table.pvtTable {
  font-size: 16px !important;
}

/* Tablet (768-1023px) */
@media (max-width: 1023px) {
  table.pvtTable {
    font-size: 14px !important;
  }
}

/* Mobile (480-767px) */
@media (max-width: 767px) {
  table.pvtTable {
    font-size: 13px !important;
  }
}

/* Petit Mobile (< 480px) */
@media (max-width: 479px) {
  table.pvtTable {
    font-size: 11px !important;
  }
}
```

### Flux de Cascade
```
1920px : 16px ✓
1024px : 16px ✓
768px  : 14px ✓ (active max-width: 1023px)
480px  : 13px ✓ (active max-width: 767px)
320px  : 11px ✓ (active max-width: 479px)
```

## 7. Touch-Friendly Sizing

### Avant (Desktop)
```
Bouton height : 32px
Checkbox size : 14px
Padding : 4px
```

### Après (Mobile)
```
Bouton height : 40-44px (WCAG recommandé)
Checkbox size : 18-20px (facile à toucher)
Padding : 8-10px minimum
Espacement : 12px minimum entre éléments
```

### CSS pour Touch-Friendly

```css
/* Desktop */
button {
  padding: 8px 16px;
  min-height: auto;
}

input[type="checkbox"] {
  width: 14px;
  height: 14px;
}

/* Mobile */
@media (max-width: 767px) {
  button {
    padding: 10px 14px;
    min-height: 44px;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
}

/* Petit Mobile */
@media (max-width: 479px) {
  button {
    padding: 8px 12px;
    min-height: 40px;
  }
}
```

## 8. LocalStorage pour Persistance

### Sauvegarder la Préférence

```javascript
// Quand l'utilisateur change la taille de colonne
$('#column-size-select').on('change', function() {
  const selectedSize = $(this).val();
  
  // Sauvegarder dans localStorage
  try {
    localStorage.setItem('columnSizePreference', selectedSize);
    console.log('Taille sauvegardée:', selectedSize);
  } catch (e) {
    console.warn("Impossible de sauvegarder:", e);
  }
});
```

### Restaurer la Préférence

```javascript
// Au chargement de la page
function restoreColumnSizeAfterViewChange() {
  // Récupérer la taille sauvegardée
  const savedColumnSize = localStorage.getItem('columnSizePreference') || '1.0';
  
  // Mettre à jour le sélecteur
  const selector = document.getElementById('column-size-select');
  if (selector) {
    selector.value = savedColumnSize;
  }
  
  // Appliquer la taille
  changeColumnSize(savedColumnSize);
  
  console.log('Taille restaurée:', savedColumnSize);
}

// Appeler au démarrage
document.addEventListener('DOMContentLoaded', () => {
  restoreColumnSizeAfterViewChange();
});
```

### Données Persistées

```javascript
// Avant la fermeture du navigateur (Utilisateur ferme la page)
localStorage: {
  'columnSizePreference': '0.5',  // Mobile size
  'fixedWidthMode': 'false'
}

// Après la réouverture (Utilisateur ouvre la page)
// Les préférences sont restaurées automatiquement
columnSize = 0.5  // ✓ Restauré
fixedWidthMode = false  // ✓ Restauré
```

## 9. Orientation Change Handler

### Détecter le Changement d'Orientation

```javascript
window.addEventListener('orientationchange', () => {
  // La hauteur et la largeur ont changé
  setTimeout(() => {
    // Attendre 100ms que le DOM se stabilise
    applyResponsiveColumnSize();
    handleWindowResize();
  }, 100);
});
```

### Résultat Selon l'Orientation

```
Portrait (375x667) :
- Largeur : 375px
- getScreenSize() : 'mobile-small'
- Taille colonne : 0.4x

Rotate...

Landscape (667x375) :
- Largeur : 667px
- getScreenSize() : 'tablet'
- Taille colonne : 0.7x
- Padding réduit pour hauteur < 500px
```

## 10. Z-Index Management pour Sticky Headers

### Problème d'Overlap

```
Sans z-index correct :
┌─────────────────┐
│ Header Col 1    │  ← Devrait rester au top
│ Header Row 1    │  ← Devrait rester à gauche (et sur le header col!)
└─────────────────┘
```

### Solution avec Z-Index

```css
/* Header de colonne : z-index: 10 */
table.pvtTable thead tr th {
  position: sticky;
  top: 0;
  z-index: 10;  /* Au-dessus du contenu */
}

/* Header de ligne : z-index: 11 */
table.pvtTable tbody tr th {
  position: sticky;
  left: 0;
  z-index: 11;  /* Au-dessus du header de colonne */
}
```

### Résultat

```
Correct avec z-index :
┌──────────┬──────────┐
│ Col1 (10)│ Col2 (10)│  ← Reste au top
├──────────┼──────────┤
│ Row1 (11)│ Data     │  ← Row1 overlaps Col1 correctement
│ Row2 (11)│ Data     │  ← Z-index: 11 > 10, donc Row1 visible
└──────────┴──────────┘
```

## 11. Responsive Font Sizes

### Calcul des Tailles

```javascript
// Desktop base
baseSize = 16px (body)

// Calcul pour chaque breakpoint
mobile = baseSize * 0.8125 = 13px
tablet = baseSize * 0.875 = 14px
mobile-small = baseSize * 0.6875 = 11px

// Pour éléments spécifiques
table font = baseSize * factor
headers = baseSize * 0.875
controls = baseSize * 0.875
```

### Cascade de Styles

```css
/* Héritée du body */
table.pvtTable {
  font-size: 16px; /* Desktop */
}

/* Responsive scales */
@media (max-width: 1023px) {
  table.pvtTable {
    font-size: 14px; /* Tablet */
  }
}

@media (max-width: 767px) {
  table.pvtTable {
    font-size: 13px; /* Mobile */
  }
}

@media (max-width: 479px) {
  table.pvtTable {
    font-size: 11px; /* Mobile-small */
  }
}

/* Minimum absolu */
table.pvtTable {
  min-font-size: 10px; /* Pour lisibilité */
}
```

## 12. Intégration Complète

### Flux Complet de Chargement

```javascript
// 1. Page charge
document.addEventListener('DOMContentLoaded', () => {
  // 2. Initialiser responsive
  initResponsiveDesign();
  
  // 3. Ajouter event listeners
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleResize);
});

// 4. Grist envoie les données
grist.onRecords(async (records) => {
  // 5. Créer le tableau
  $('#table').pivotUI(records, config);
  
  // 6. Initialiser responsive
  setTimeout(() => {
    initResponsiveDesign();
    optimizeTableForMobile();
  }, 300);
});

// 7. Utilisateur redimensionne
window.addEventListener('resize', () => {
  // 8. Débounce (250ms)
  // 9. Appeler handleWindowResize()
  // 10. Appliquer applyResponsiveColumnSize()
  // 11. Appliquer optimizeTableForMobile()
  // 12. Afficher les données adaptées
});
```

## Résumé Visuel

```
Écran                    Taille Col  Font   Padding  Layout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2560px (Ultra HD)        1.0x        16px   20px     Horizontal
1920px (Desktop)         1.0x        16px   20px     Horizontal
1280px (Laptop)          1.0x        16px   20px     Horizontal
1024px (Desktop small)    1.0x        16px   20px     Horizontal
768px (Tablet)           0.7x        14px   12px     Horizontal
480px (Mobile)           0.5x        13px   12px     Horizontal
375px (iPhone)           0.4x        12px   10px     Vertical scroll
320px (Mini)             0.4x        11px   8px      Vertical scroll
```

