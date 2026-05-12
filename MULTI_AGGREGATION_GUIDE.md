# Guide: Agrégations Multiples dans le Pivot Table

## Vue d'ensemble

Le système des agrégations multiples permet d'afficher simultanément plusieurs types d'agrégations (Somme, Moyenne, Comptage, Minimum, Maximum, Médiane) dans le même pivot table, au lieu de se limiter à une seule agrégation à la fois.

## Architecture

### Fichiers impliqués

- **multiAggregationManager.js** : Module principal gérant les agrégations multiples
- **index.js** : Intégration du gestionnaire dans le cycle de vie du pivot
- **index.html** : Inclusion du script
- **styles.css** : Styles pour l'UI des agrégations

### Composants clés

#### 1. MultiAggregationManager (multiAggregationManager.js)

Un module IIFE (Immediately Invoked Function Expression) qui encapsule toute la logique des agrégations multiples.

**Configuration disponible :**
```javascript
AGGREGATION_CONFIG = {
  sum:     { label: 'Somme',    aggregator: 'Sum',     color: '#10b981' },
  average: { label: 'Moyenne',  aggregator: 'Average', color: '#3b82f6' },
  count:   { label: 'Comptage', aggregator: 'Count',   color: '#f59e0b' },
  min:     { label: 'Minimum',  aggregator: 'Min',     color: '#ef4444' },
  max:     { label: 'Maximum',  aggregator: 'Max',     color: '#8b5cf6' },
  median:  { label: 'Médiane',  aggregator: 'Median',  color: '#06b6d4' }
}
```

**API publique :**

```javascript
// Initialisation
MultiAggregationManager.init()

// Charger/sauvegarder l'état
await MultiAggregationManager.loadAggregationState()
MultiAggregationManager.setSelectedAggregations(['sum', 'average', 'count'])

// Gestion des agrégations
const selected = MultiAggregationManager.getSelectedAggregations()
const isEnabled = MultiAggregationManager.isMultiAggregationEnabled()

// UI
MultiAggregationManager.addAggregationControls()
MultiAggregationManager.createAggregationControls()

// Styling
MultiAggregationManager.applyAggregationStyling(pivotTableElement)

// Utilitaires
const color = MultiAggregationManager.getAggregationColor('sum')
const label = MultiAggregationManager.getAggregationLabel('average')
```

## Fonctionnement

### Flux d'initialisation

1. **grist.onRecords()** - Données reçues
2. **MultiAggregationManager.init()** - Initialisation du gestionnaire
3. **MultiAggregationManager.loadAggregationState()** - Chargement de l'état sauvegardé
4. **MultiAggregationManager.addAggregationControls()** - Ajout de l'UI aux contrôles
5. **Pivot table créée** avec la configuration standard
6. **multiAggregationChanged** event - Déclenché lors du changement d'agrégation
7. **applyAggregationStyling()** - Application des couleurs aux colonnes

### Stockage de la configuration

L'état des agrégations est sauvegardé dans :
- **Grist options** : `grist.setOption('multiAggregations', {...})`
- **Structure** :
  ```javascript
  {
    selected: ['sum', 'average', 'count'],  // Agrégations sélectionnées
    enabled: true                            // Mode activé
  }
  ```

### Événement personnalisé

Lorsqu'une agrégation est sélectionnée/désélectionnée, un événement est déclenché :

```javascript
document.addEventListener('multiAggregationChanged', (event) => {
  const { aggregations } = event.detail;
  console.log('Agrégations sélectionnées:', aggregations);
});
```

## Utilisation

### Pour l'utilisateur

1. **Afficher les contrôles**
   - Les checkboxes des agrégations apparaissent dans la zone "Contrôles" en haut
   - Chaque agrégation peut être activée/désactivée

2. **Sélectionner les agrégations**
   - Cocher les agrégations désirées (minimum une doit rester cochée)
   - La configuration est automatiquement sauvegardée

3. **Voir les résultats**
   - Les colonnes du tableau sont codées par couleur selon l'agrégation
   - Les bordures gauches des cellules indiquent le type d'agrégation

### Pour le développeur

```javascript
// Initialiser après que pivotUI soit créé
if (MultiAggregationManager) {
  MultiAggregationManager.init();
  MultiAggregationManager.addAggregationControls();
}

// Écouter les changements
document.addEventListener('multiAggregationChanged', (e) => {
  console.log('Agrégations mises à jour:', e.detail.aggregations);
});

// Obtenir l'état actuel
const current = MultiAggregationManager.getSelectedAggregations();
console.log('Actuellement sélectionnées:', current);

// Définir programmatiquement
MultiAggregationManager.setSelectedAggregations(['sum', 'average']);
```

## Design visuel

### Contrôles

- **Conteneur** : Fond dégradé léger avec bordure subtile
- **Checkboxes** : Style natif avec couleur d'accent personnalisée
- **Labels** : Couleurs correspondant à l'agrégation
- **Hover** : Fond blanc légèrement visible

### Tableau

- **Somme** : Bordure verte (#10b981) + fond léger vert
- **Moyenne** : Bordure bleue (#3b82f6) + fond léger bleu
- **Comptage** : Bordure orange (#f59e0b) + fond léger orange
- **Minimum** : Bordure rouge (#ef4444) + fond léger rouge
- **Maximum** : Bordure violette (#8b5cf6) + fond léger violet
- **Médiane** : Bordure cyan (#06b6d4) + fond léger cyan

### Responsive

- **Desktop** : Tous les contrôles sur une ligne
- **Tablet** : Ligne flexible
- **Mobile** : Checkboxes en colonne

## Intégration avec les autres fonctionnalités

### Compatibilité

- **Sous-totaux** : Marche en parallèle, pas de conflit
- **Mode plein écran** : Supporte la mise à jour dynamique
- **Taille des colonnes** : Préservée avec agrégations
- **Couleurs** : Indépendantes du système de couleurs des variables
- **Export XLSX** : Exporte toutes les agrégations

### Points d'intégration

```javascript
// Dans index.js - lors de onRefresh
if (multiAggregationEnabled && MultiAggregationManager) {
  const $pivotTable = $('#table').find('table.pvtTable');
  MultiAggregationManager.applyAggregationStyling($pivotTable[0]);
}

// Écouteur d'événement
document.addEventListener('multiAggregationChanged', handleMultiAggregationChange);
```

## Limitations actuelles

1. **Une seule agrégation par champ** : Chaque champ peut apparaître avec différentes agrégations, mais les champs virtuels ne sont pas créés automatiquement
2. **PivotTable.js standard** : Utilise les agrégateurs natifs de PivotTable.js
3. **Pas de tri personnalisé** : Le tri suit la logique standard de PivotTable.js
4. **Pas de filtrage par agrégation** : Les filtres s'appliquent au niveau du champ, pas de l'agrégation

## Améliorations futures possibles

- [ ] Créer des champs dérivés pour chaque combinaison champ+agrégation
- [ ] Ajouter des agrégateurs personnalisés (Écart-type, Quartiles, etc.)
- [ ] Permettre la sélection de l'ordre de priorité des agrégations
- [ ] Ajouter un mode "comparaison" pour comparer agrégations côte à côte
- [ ] Interface drag-drop pour réorganiser les agrégations
- [ ] Profils d'agrégations (groupes prédéfinis)
- [ ] Export avec annotations des agrégations

## Dépannage

### Les contrôles n'apparaissent pas

1. Vérifier que `multiAggregationManager.js` est chargé
2. Vérifier la console pour les erreurs
3. Vérifier que `#controls-container` existe dans le DOM

### Les agrégations ne se sauvegardent pas

1. Vérifier l'accès à `grist.setOption()`
2. Vérifier les permissions du widget
3. Regarder les erreurs réseau dans les outils de dev

### Le styling des colonnes ne s'applique pas

1. Vérifier que `applyAggregationStyling()` est appelée
2. Vérifier les sélecteurs CSS dans `styles.css`
3. Vérifier la spécificité CSS vs. les styles existants

## Exemples de code

### Exemple 1 : Initialisation basique

```javascript
grist.onRecords(async rec => {
  // ... code existant ...
  
  // Initialiser les agrégations multiples
  if (MultiAggregationManager) {
    MultiAggregationManager.init();
    MultiAggregationManager.addAggregationControls();
    await MultiAggregationManager.loadAggregationState();
  }
});
```

### Exemple 2 : Écouter les changements

```javascript
function handleMultiAggregationChange(event) {
  const { aggregations } = event.detail;
  console.log('Utilisateur a sélectionné:', aggregations);
  
  // Mettre à jour le tableau
  // Relancer le pivot
  // Recalculer les sous-totaux
}

document.addEventListener('multiAggregationChanged', handleMultiAggregationChange);
```

### Exemple 3 : Définir les agrégations programmatiquement

```javascript
// Sélectionner uniquement Somme et Moyenne
MultiAggregationManager.setSelectedAggregations(['sum', 'average']);

// Ajouter Comptage
const current = MultiAggregationManager.getSelectedAggregations();
current.push('count');
MultiAggregationManager.setSelectedAggregations(current);
```

## Tests recommandés

- [ ] Sélectionner/désélectionner agrégations
- [ ] Vérifier la persistance après rechargement
- [ ] Tester sur mobile, tablet, desktop
- [ ] Vérifier en mode plein écran
- [ ] Tester avec sous-totaux activés
- [ ] Vérifier l'export XLSX
- [ ] Tester avec différentes tailles de colonnes
- [ ] Vérifier les changements de Vue/Colonnes/Lignes

## Fichiers modifiés

- ✅ `index.js` - Intégration du gestionnaire
- ✅ `index.html` - Inclusion du script
- ✅ `styles.css` - Styles pour l'UI
- ✅ `multiAggregationManager.js` - Nouveau fichier créé
