# Comparatif avant/après - Persistance du columnSize

## Problème avant

### Scénario problématique
```
1. Utilisateur ouvre le widget
2. Sélectionne "0.8x - Compact" dans le sélecteur de taille
3. La taille 0.8x s'applique correctement
4. Utilisateur passe en "Vue Tableau plein écran"
5. ❌ LA TAILLE EST RÉINITIALISÉE À 1.0x
6. L'utilisateur doit reselectionner 0.8x
```

### Cause root
- La taille était stockée uniquement dans Grist via `grist.getOption('columnSize')`
- Lors du changement de vue, le système n'appelait pas le code pour restaurer la taille
- Le sélecteur HTML revenait à la valeur par défaut

## Avant l'implémentation

### columnSizeManager.js (avant)
```javascript
// Fonctions basiques, pas de persistance
function changeColumnSize(multiplier) { /* ... */ }
function resetColumnSize() { /* ... */ }
function getCurrentColumnSize() { /* ... */ }
function setColumnSize(size) { /* ... */ }
```

### index.js - Chargement initial (avant)
```javascript
// Ligne ~112-124
const savedColumnSize = await grist.getOption('columnSize');
if (savedColumnSize) {
  $('#column-size-select').val(savedColumnSize);
  changeColumnSize(savedColumnSize);
} else {
  changeColumnSize('1.0');
}
```

### index.js - Changement de vue (avant)
```javascript
// Ligne ~216-222
$('#view-mode-select').on('change', function() {
  currentViewMode = $(this).val();
  grist.setOption('viewMode', currentViewMode);
  applyViewMode();
  // ❌ PAS DE RESTAURATION DE LA TAILLE
});
```

### index.js - Changement de taille (avant)
```javascript
// Ligne ~235-257
$('#column-size-select').on('change', function() {
  const selectedSize = $(this).val();
  
  grist.setOption('columnSize', selectedSize); // ❌ SEULEMENT GRIST
  changeColumnSize(selectedSize);
  
  if (currentViewMode === 'fullscreen') {
    updateFullscreenTable();
  }
  
  applyVariableColors();
});
```

## Après l'implémentation

### columnSizeManager.js (après)
```javascript
// Nouvelles fonctions de persistance localStorage
function saveColumnSizePreference(size) {
  try {
    localStorage.setItem('columnSizePreference', size.toString());
  } catch (e) {
    console.warn('Failed to save columnSize preference to localStorage:', e);
  }
}

function loadColumnSizePreference() {
  try {
    const saved = localStorage.getItem('columnSizePreference');
    return saved || '1.0';
  } catch (e) {
    console.warn('Failed to load columnSize preference from localStorage:', e);
    return '1.0';
  }
}

function initializeColumnSizeFromPreference() {
  const preferredSize = loadColumnSizePreference();
  setColumnSize(preferredSize);
}
```

### index.js - Chargement initial (après)
```javascript
// Ligne ~142-161
try {
  // ✅ PRIORITÉ 1: Essayer localStorage d'abord (plus rapide)
  const localStorageSize = localStorage.getItem('columnSizePreference');
  if (localStorageSize) {
    $('#column-size-select').val(localStorageSize);
    changeColumnSize(localStorageSize);
  } else {
    // ✅ PRIORITÉ 2: Fallback sur Grist
    const savedColumnSize = await grist.getOption('columnSize');
    if (savedColumnSize) {
      $('#column-size-select').val(savedColumnSize);
      changeColumnSize(savedColumnSize);
    } else {
      // ✅ PRIORITÉ 3: Valeur par défaut
      changeColumnSize('1.0');
    }
  }
} catch (e) {
  console.error("Error loading columnSize:", e);
  changeColumnSize('1.0');
}
```

### index.js - Nouvelle fonction de restauration (après)
```javascript
// Ligne ~103-130 - ✅ NOUVELLE FONCTION
function restoreColumnSizeAfterViewChange() {
  const savedColumnSize = localStorage.getItem('columnSizePreference') || '1.0';

  // Mettre à jour le sélecteur
  const selector = document.getElementById('column-size-select');
  if (selector) {
    selector.value = savedColumnSize;
  }

  // Appliquer la taille
  changeColumnSize(savedColumnSize);

  // Si on est en mode plein écran, mettre à jour le tableau cloné
  if (currentViewMode === 'fullscreen') {
    setTimeout(() => {
      updateFullscreenTable();
    }, 100);
  }

  // Réappliquer les couleurs
  setTimeout(() => {
    applyVariableColors();
  }, 150);
}
```

### index.js - Changement de vue (après)
```javascript
// Ligne ~253-262
$('#view-mode-select').on('change', function() {
  currentViewMode = $(this).val();
  grist.setOption('viewMode', currentViewMode);
  applyViewMode();

  // ✅ RESTAURER LA TAILLE APRÈS CHANGEMENT DE VUE
  restoreColumnSizeAfterViewChange();
});
```

### index.js - Sortie plein écran (après)
```javascript
// Ligne ~265-275
$('#fullscreen-exit-button').on('click', function() {
  currentViewMode = 'pivot';
  $('#view-mode-select').val('pivot');
  grist.setOption('viewMode', currentViewMode);
  applyViewMode();

  // ✅ RESTAURER LA TAILLE À LA SORTIE DU PLEIN ÉCRAN
  restoreColumnSizeAfterViewChange();
});
```

### index.js - Changement de taille (après)
```javascript
// Ligne ~278-307
$('#column-size-select').on('change', function() {
  const selectedSize = $(this).val();

  // ✅ SAUVEGARDER DANS LOCALSTORAGE (PRIORITAIRE)
  try {
    localStorage.setItem('columnSizePreference', selectedSize);
  } catch (e) {
    console.warn("Failed to save columnSize to localStorage:", e);
  }

  // ✅ GARDER AUSSI GRIST POUR COMPATIBILITÉ
  grist.setOption('columnSize', selectedSize);

  changeColumnSize(selectedSize);

  if (currentViewMode === 'fullscreen') {
    updateFullscreenTable();
  }

  applyVariableColors();
});
```

## Résultat après implémentation

### Nouveau scénario
```
1. Utilisateur ouvre le widget
2. Sélectionne "0.8x - Compact" dans le sélecteur de taille
3. La taille 0.8x s'applique correctement
4. ✅ Est sauvegardée dans localStorage ET Grist
5. Utilisateur passe en "Vue Tableau plein écran"
6. ✅ LA TAILLE RESTE 0.8x (restaurée depuis localStorage)
7. Utilisateur revient en mode normal
8. ✅ LA TAILLE RESTE 0.8x (restaurée depuis localStorage)
9. Utilisateur recharge la page
10. ✅ LA TAILLE EST ENCORE 0.8x (chargée au démarrage)
```

## Comparaison de la persistance

| Aspect | Avant | Après |
|--------|-------|-------|
| **Stockage** | Grist uniquement | localStorage + Grist (fallback) |
| **Vitesse de chargement** | Lent (appel Grist asynchrone) | Rapide (localStorage synchrone) |
| **Persistance après rechargement** | ✓ (si Grist accessible) | ✓ (localStorage persiste toujours) |
| **Persistance après changement de vue** | ❌ PERTE | ✓ Maintenue |
| **Synchronisation du sélecteur** | ❌ DÉSYNCHRONISÉ après changement de vue | ✓ Toujours synchronisé |
| **Gestion des erreurs** | Basique | Try/catch robuste |
| **Nombre de requêtes** | 2 (grist.setOption + grist.getOption) | 1 localStorage + 1 Grist (async) |

## Avantages de la nouvelle approche

### 1. Robustesse
- localStorage agit comme cache local rapide
- Grist agit comme stockage persistant global
- Fallback automatique si l'un échoue

### 2. Performance
- Pas d'attente pour localStorage (synchrone)
- Grist stockage en parallèle (async)
- Chargement initial plus rapide

### 3. Expérience utilisateur
- Pas de réinitialisation à 1.0x lors du changement de vue
- Sélecteur toujours synchronisé avec l'état réel
- Préférence conservée entre sessions

### 4. Flexibilité
- Fonctionne même si Grist n'est pas disponible
- localStorage indépendant du contexte Grist
- Peut fonctionner hors ligne pour le localStorage

## Code supplémentaire

- **columnSizeManager.js**: +60 lignes (3 fonctions + exports)
- **index.js**: +40 lignes (1 fonction + modifications gestionnaires)
- **Total**: ~100 lignes supplémentaires

## Impact sur les tests

### Avant
- Test 1: Changement de taille ✓
- Test 2: Changement de vue → Réinitialisation ❌
- Test 3: Rechargement → Récupération Grist ✓

### Après
- Test 1: Changement de taille ✓
- Test 2: Changement de vue → Préservation ✓
- Test 3: Rechargement → Récupération localStorage ✓
- Test 4: localStorage vide → Fallback Grist ✓
