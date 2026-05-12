# Implémentation des Sous-totaux - Documentation Technique

## Vue d'ensemble

L'implémentation des sous-totaux ajoute automatiquement des lignes de sous-totaux après chaque groupe dans un tableau croisé dynamique (pivot table) basé sur pivottable.js v2.23.0.

## Fichiers Modifiés et Créés

### Fichiers Créés
1. **subtotalsManager.js** - Gestionnaire principal des sous-totaux

### Fichiers Modifiés
1. **index.html** - Ajout du script subtotalsManager.js et contrôle checkbox
2. **index.js** - Intégration de la logique des sous-totaux
3. **styles.css** - Styles pour les lignes et cellules de sous-totaux

## Architecture de la Fonctionnalité

### subtotalsManager.js

#### Fonctions Principales

**`addSubtotalsToTable(config)`**
- Point d'entrée pour ajouter les sous-totaux au tableau principal
- Accepte la configuration actuelle du pivot table (rows, cols, vals, aggregatorName, rendererName)
- Applique un délai pour laisser le pivot table se rendre

**`setSubtotalsEnabled(enabled)`**
- Active ou désactive les sous-totaux
- Supprime toutes les lignes de sous-totaux si désactivé

**`processTableForSubtotals($table, config)`**
- Fonction de traitement du DOM qui :
  1. Supprime les anciens sous-totaux
  2. Regroupe les lignes par valeur de première colonne
  3. Ajoute une ligne de sous-total après chaque groupe
  4. Applique les styles CSS

**`groupRowsByFirstColumn($rows)`**
- Regroupe les lignes par changement de valeur dans la première colonne
- Retourne un array de groupes avec leurs lignes respectives
- Ignore automatiquement les lignes de totaux

**`createSubtotalRow($table, lastRow, rows, config)`**
- Crée une ligne de sous-total avec le nombre de colonnes correct
- Calcule les sous-totaux pour chaque colonne numérique
- Libellé : "Subtotal: [valeur du groupe]"

**`getCellNumericValue(cell)`**
- Extrait la valeur numérique d'une cellule (gère les virgules, points décimaux)

**`isTotalCell(cell)`**
- Détecte si une cellule est un total (par classe CSS ou contenu textuel)

### Intégration dans index.js

#### État Global
```javascript
let subtotalsEnabledState = false; // État des sous-totaux
```

#### Points d'Intégration

1. **Chargement initial** (ligne ~245)
   - Restaure l'état des sous-totaux depuis Grist
   - Met à jour la case à cocher

2. **onRefresh callback** (ligne ~203 et ~228)
   - Ajoute les sous-totaux après chaque changement de configuration
   - Gère le mode plein écran

3. **checkPivotTableAndApplyFullscreen()** (ligne ~97)
   - Ajoute les sous-totaux quand le tableau est prêt

4. **Gestionnaire checkbox** (ligne ~378)
   - Sauvegarde l'état dans Grist
   - Déclenche l'ajout/suppression des sous-totaux

### Styles CSS

#### Classes CSS

**`.subtotal-row`**
- Classe appliquée à la ligne de sous-total entière
- Fond gris clair (#f0f4f8) pour différenciation

**`.subtotal-cell`**
- Style appliqué à chaque cellule de sous-total
- Police italique légèrement diminuée
- Bordure supérieure épaisse pour séparation visuelle

**`.subtotal-label`**
- Première cellule avec le libellé du groupe
- Fond plus foncé (#e2e8f0)
- Texte gras

**`.subtotal-value`**
- Cellules de valeurs numériques
- Alignement à droite
- Couleur distinctive

#### Mode Sombre
- Adaptation complète des couleurs pour le mode sombre
- Fond #2d3748, texte #cbd5e1, bordures #475569

## Flux de Traitement

### Activation des Sous-totaux

```
Utilisateur coche checkbox
    ↓
Événement change déclencheur
    ↓
subtotalsEnabledState = true
    ↓
grist.setOption('subtotalsEnabled', true)
    ↓
SubtotalsManager.setSubtotalsEnabled(true)
    ↓
SubtotalsManager.addSubtotalsToTable(config)
    ↓
processTableForSubtotals() exécuté
    ↓
Lignes de sous-totaux ajoutées au DOM
```

### Mise à Jour des Sous-Totaux

Lors de chaque changement de pivot (rows, cols, vals, etc.) :
```
onRefresh callback exécuté
    ↓
Pivot table re-rendu
    ↓
SubtotalsManager.addSubtotalsToTable() appelé
    ↓
Anciens sous-totaux supprimés, nouveaux ajoutés
```

## Algorithme de Calcul des Sous-Totaux

1. **Regroupement** : Les lignes sont groupées par valeur de première colonne
2. **Détection de fin de groupe** : Quand la valeur change ou une ligne de total est atteinte
3. **Calcul** : Somme de tous les valeurs numériques pour chaque colonne du groupe
4. **Arrondi** : Format à 2 décimales

## Cas Limites Gérés

- **Ligne de total existantes** : Ignorées lors du regroupement
- **Valeurs non-numériques** : Convertie en 0 pour le calcul
- **Modifications rapides** : Debounce avec `lastSubtotalsConfig`
- **Mode plein écran** : Réplication des sous-totaux au tableau cloné
- **Changement de taille colonne** : Les sous-totaux subsistent et se réadaptent

## Persistance des Paramètres

L'état des sous-totaux est sauvegardé dans Grist via :
```javascript
grist.setOption('subtotalsEnabled', subtotalsEnabledState)
```

Cela persiste à travers les sessions et actualisations de page.

## Performance

- Délai de 150ms avant traitement pour laisser le pivot table se rendre
- Comparaison de config avec `JSON.stringify()` pour éviter les appels redondants
- Traitement en sens inverse des indices pour éviter les décalages lors de l'insertion

## Compatibilité

- **pivottable.js** : v2.23.0 confirmée
- **jQuery** : 3.6.1+
- **Mode sombre** : Support complet via CSS
- **Responsive** : Fonctionne avec tous les tailles de colonne (0.25x à 1.0x)

## Tests Recommandés

1. Activer/désactiver les sous-totaux
2. Modifier rows/cols/vals et vérifier que les sous-totaux se mettent à jour
3. Changer de mode (pivot vs fullscreen)
4. Ajuster la taille des colonnes
5. Basculer entre mode clair et sombre
6. Vérifier la persistance après refresh
7. Tester avec différentes agrégations (Sum, Count, Moyenne, etc.)
8. Vérifier que les totaux ne sont pas doublés

## Limitations Connues

1. Les sous-totaux sont basés sur le premier niveau de groupement
2. Pas de support multi-niveaux hiérarchiques (à implémenter si nécessaire)
3. Les calculs personnalisés ne sont pas inclus dans les sous-totaux (seul la somme est appliquée)
4. Performance peut diminuer avec très grandes tables (>10000 lignes)
