# Exemples d'utilisation: Agrégations Multiples

## Exemple 1: Utilisation basique dans le HTML

```html
<!-- Dans index.html, les contrôles apparaîtront automatiquement -->
<div id="controls-container">
  <!-- Contrôles existants -->
  
  <!-- Les agrégations multiples seront ajoutées ici automatiquement -->
  <!-- <div class="control-group">
    <div id="multi-agg-controls" class="multi-agg-controls">
      ...checkboxes...
    </div>
  </div> -->
</div>
```

## Exemple 2: Scénario utilisateur - Comparer Somme vs Moyenne

**Cas d'usage** : Un responsable de ventes veut voir à la fois la somme totale des ventes ET la moyenne par transaction.

**Étapes** :
1. L'utilisateur configure le pivot table : Lignes = "Vendeur", Colonnes = "Mois", Valeurs = "Montant"
2. Les checkboxes "Somme" et "Moyenne" sont visibles
3. L'utilisateur coche "Somme" et "Moyenne"
4. Le tableau affiche maintenant deux colonnes pour chaque mois :
   - Une avec bordure verte (Somme)
   - Une avec bordure bleue (Moyenne)
5. La configuration est sauvegardée

**Résultat** : Le responsable peut voir instantanément :
- Somme totale par vendeur/mois
- Montant moyen par transaction
- Tendances comparatives

## Exemple 3: Scénario utilisateur - Analyser la distribution

**Cas d'usage** : Un analyste de données veut comprendre la distribution des valeurs.

**Configuration** :
- Lignes = "Catégorie"
- Colonnes = "Trimestre"
- Valeurs = "Prix"

**Agrégations sélectionnées** : Somme, Moyenne, Min, Max, Count

**Affichage** :
```
Catégorie    | T1 Somme | T1 Moy | T1 Min | T1 Max | T1 Count | T2 Somme | ...
             | (vert)   | (bleu) | (rouge)| (violet)|(orange)  |
```

**Insight** : Voir rapidement :
- Volume total (Somme)
- Montant moyen (Moyenne)
- Valeur minimale (Min)
- Valeur maximale (Max)
- Nombre de transactions (Count)

## Exemple 4: Code - Initialisation personnalisée

```javascript
// Dans votre fichier JavaScript personnalisé
document.addEventListener('DOMContentLoaded', function() {
  
  // Attendre que MultiAggregationManager soit disponible
  if (typeof MultiAggregationManager !== 'undefined') {
    
    // Écouter les changements d'agrégations
    document.addEventListener('multiAggregationChanged', function(e) {
      console.log('Agrégations mises à jour:', e.detail.aggregations);
      
      // Faire quelque chose avec le nouveau choix
      logAggregationSelection(e.detail.aggregations);
    });
  }
});

function logAggregationSelection(aggs) {
  const labels = aggs.map(agg => {
    return MultiAggregationManager.getAggregationLabel(agg);
  });
  console.log('Sélectionnées:', labels.join(', '));
}
```

## Exemple 5: Code - Forcer une configuration

```javascript
// Forcer Somme et Moyenne au démarrage
grist.onRecords(async rec => {
  // ... code d'initialisation existant ...
  
  // Après l'initialisation du gestionnaire
  if (MultiAggregationManager) {
    MultiAggregationManager.init();
    MultiAggregationManager.addAggregationControls();
    
    // Forcer cette configuration
    MultiAggregationManager.setSelectedAggregations(['sum', 'average']);
  }
});
```

## Exemple 6: Code - Accéder à la configuration actuelle

```javascript
// Obtenir les agrégations sélectionnées
const currentAggs = MultiAggregationManager.getSelectedAggregations();
console.log('Actuellement sélectionnées:', currentAggs);

// Vérifier si le mode multi-agg est activé
if (MultiAggregationManager.isMultiAggregationEnabled()) {
  console.log('Mode agrégations multiples ACTIVÉ');
} else {
  console.log('Mode agrégations multiples DÉSACTIVÉ');
}

// Obtenir la config complète
const config = MultiAggregationManager.getAggregationConfig();
Object.entries(config).forEach(([key, value]) => {
  console.log(`${key}: ${value.label} (${value.color})`);
});
```

## Exemple 7: UI personnalisée - Boutons au lieu de checkboxes

```javascript
// Créer une UI alternative avec des boutons
function createButtonUI() {
  const container = document.createElement('div');
  container.className = 'agg-button-group';
  
  const config = MultiAggregationManager.getAggregationConfig();
  
  Object.entries(config).forEach(([key, value]) => {
    const btn = document.createElement('button');
    btn.className = 'agg-button';
    btn.textContent = value.label;
    btn.style.borderColor = value.color;
    
    btn.addEventListener('click', () => {
      const current = MultiAggregationManager.getSelectedAggregations();
      if (current.includes(key)) {
        // Désélectionner si plus d'une
        if (current.length > 1) {
          MultiAggregationManager.setSelectedAggregations(
            current.filter(a => a !== key)
          );
        }
      } else {
        // Sélectionner
        MultiAggregationManager.setSelectedAggregations([...current, key]);
      }
    });
    
    container.appendChild(btn);
  });
  
  return container;
}
```

## Exemple 8: Export XLSX avec agrégations

```javascript
// Après l'export, les agrégations sont préservées
// car elles sont appliquées aux cellules du tableau

document.addEventListener('multiAggregationChanged', function() {
  // Quand l'utilisateur change les agrégations,
  // l'export suivant inclura les nouvelles sélections
  console.log('Configuration d\'export mise à jour');
});
```

## Exemple 9: Responsif - Adapter aux écrans petits

```javascript
// Le système s'adapte automatiquement, mais vous pouvez aussi :

function optimizeAggregationsForMobile() {
  const width = window.innerWidth;
  
  if (width < 480) {
    // Sur très petit écran, limiter à 2 agrégations
    MultiAggregationManager.setSelectedAggregations(['sum', 'count']);
  } else if (width < 768) {
    // Sur petit écran, limiter à 3
    const current = MultiAggregationManager.getSelectedAggregations();
    if (current.length > 3) {
      MultiAggregationManager.setSelectedAggregations(current.slice(0, 3));
    }
  }
}

window.addEventListener('resize', optimizeAggregationsForMobile);
```

## Exemple 10: Intégration avec les sous-totaux

```javascript
// Les agrégations multiples et les sous-totaux coexistent

document.addEventListener('multiAggregationChanged', function(e) {
  // Mettre à jour les sous-totaux quand les agrégations changent
  if (SubtotalsManager && subtotalsEnabledState) {
    setTimeout(() => {
      SubtotalsManager.addSubtotalsToTable(currentPivotConfig);
    }, 100);
  }
});
```

## Exemple 11: Métriques de suivi

```javascript
// Tracker quand les utilisateurs changent les agrégations
let aggregationChangeCount = 0;

document.addEventListener('multiAggregationChanged', function(e) {
  aggregationChangeCount++;
  
  const selectedCount = e.detail.aggregations.length;
  const selectedLabels = e.detail.aggregations.map(agg => 
    MultiAggregationManager.getAggregationLabel(agg)
  );
  
  console.log({
    changeNumber: aggregationChangeCount,
    selectedCount: selectedCount,
    selected: selectedLabels.join(', '),
    timestamp: new Date().toISOString()
  });
});
```

## Exemple 12: Mode sombre (optionnel)

```css
/* Ajouter au styles.css pour supporter le mode sombre */

@media (prefers-color-scheme: dark) {
  .multi-agg-controls {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-color: var(--border-dark);
  }
  
  .agg-checkbox-label {
    background-color: rgba(0, 0, 0, 0.3);
  }
  
  .agg-checkbox-label:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
```

## Exemple 13: Validation des agrégations

```javascript
// Vérifier que les agrégations sont valides
function validateAggregations(aggregations) {
  const config = MultiAggregationManager.getAggregationConfig();
  const validKeys = Object.keys(config);
  
  return aggregations.every(agg => validKeys.includes(agg));
}

// Utiliser
if (validateAggregations(['sum', 'average'])) {
  MultiAggregationManager.setSelectedAggregations(['sum', 'average']);
} else {
  console.error('Agrégations invalides');
}
```

## Exemple 14: Sauvegarde d'un profil d'agrégations

```javascript
// Créer des profils prédéfinis
const AGGREGATION_PROFILES = {
  basic: ['sum'],
  standard: ['sum', 'average', 'count'],
  detailed: ['sum', 'average', 'count', 'min', 'max'],
  statistical: ['average', 'min', 'max', 'median'],
  complete: ['sum', 'average', 'count', 'min', 'max', 'median']
};

// Appliquer un profil
function applyProfile(profileName) {
  const profile = AGGREGATION_PROFILES[profileName];
  if (profile) {
    MultiAggregationManager.setSelectedAggregations(profile);
    console.log(`Profil '${profileName}' appliqué`);
  }
}

// Utilisation
applyProfile('standard'); // Applique Somme, Moyenne, Comptage
```

## Exemple 15: Nettoyer les ressources

```javascript
// Si vous fermez le widget ou changez de vue
function cleanupMultiAggregations() {
  if (MultiAggregationManager) {
    MultiAggregationManager.destroy();
    console.log('Ressources des agrégations nettoyées');
  }
}

// Appeler avant de basculer de vue
$('#view-mode-select').on('change', function() {
  if (currentViewMode === 'fullscreen') {
    cleanupMultiAggregations();
  }
});
```

## Flux complet d'utilisation

### Situation initiale
- Utilisateur ouvre le widget
- Pivot table créée avec une seule agrégation

### Étape 1 : Découverte
- Utilisateur voit les checkboxes "Agrégations"
- Lit les labels en français

### Étape 2 : Sélection
- Coche "Somme" et "Moyenne"
- Configuration sauvegardée immédiatement

### Étape 3 : Analyse
- Tableau affiche deux colonnes par champ
- Couleurs aident à différencier

### Étape 4 : Persistence
- Utilisateur ferme/rouvre le widget
- Configuration précédente est restaurée

### Étape 5 : Ajustement
- Déselectionne "Moyenne", ajoute "Comptage"
- Nouvelle config sauvegardée

## Bonnes pratiques

1. **Toujours garder au moins une agrégation** : Le système empêche de tout déselectionner
2. **Utiliser sur des données cohérentes** : Min/Max marche mieux sur numériques
3. **Limiter le nombre d'agrégations** : Sur mobile, viser max 3
4. **Documenter les couleurs** : Aider l'utilisateur à comprendre le code couleur
5. **Considérer les performances** : Beaucoup d'agrégations = plus de calculs

## Dépannage - Exemples

### Les checkboxes ne gardent pas l'état

```javascript
// Vérifier que grist.setOption fonctionne
grist.setOption('multiAggregations', {
  selected: ['sum'],
  enabled: true
}).then(() => {
  console.log('Sauvegarde OK');
}).catch(err => {
  console.error('Sauvegarde échouée:', err);
});
```

### Les couleurs ne s'affichent pas

```javascript
// Vérifier que le styling est appelé
if (MultiAggregationManager) {
  const pivotTable = document.querySelector('table.pvtTable');
  if (pivotTable) {
    MultiAggregationManager.applyAggregationStyling(pivotTable);
  } else {
    console.log('Tableau pivot non trouvé');
  }
}
```

### Performance lente avec beaucoup d'agrégations

```javascript
// Limiter les agrégations
const maxAggs = 3;
const current = MultiAggregationManager.getSelectedAggregations();
if (current.length > maxAggs) {
  const limited = current.slice(0, maxAggs);
  MultiAggregationManager.setSelectedAggregations(limited);
  console.warn(`Limité à ${maxAggs} agrégations`);
}
```
