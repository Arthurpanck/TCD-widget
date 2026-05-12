# Guide de test - Persistance du columnSize

## Description du problème résolu
Lorsque l'utilisateur changeait entre le mode "Vue Tableau Croisé Dynamique" et "Vue Tableau plein écran", la taille des colonnes (columnSize) était réinitialisée à 1.0x (Normal) au lieu de conserver la préférence de l'utilisateur.

## Solution implémentée

### 1. Modifications dans `columnSizeManager.js`
- **Ajout de `saveColumnSizePreference(size)`**: Sauvegarde la taille dans localStorage sous la clé `columnSizePreference`
- **Ajout de `loadColumnSizePreference()`**: Restaure la taille sauvegardée depuis localStorage
- **Ajout de `initializeColumnSizeFromPreference()`**: Initialise la taille au chargement

### 2. Modifications dans `index.js`

#### a) Chargement initial (ligne ~142-161)
```javascript
// Essayer d'abord localStorage (préférence locale persistante)
const localStorageSize = localStorage.getItem('columnSizePreference');
if (localStorageSize) {
  $('#column-size-select').val(localStorageSize);
  changeColumnSize(localStorageSize);
} else {
  // Sinon, essayer les options Grist
  const savedColumnSize = await grist.getOption('columnSize');
  // ...
}
```

#### b) Nouvelle fonction `restoreColumnSizeAfterViewChange()` (ligne ~103-130)
Restaure la taille sauvegardée lors d'un changement de vue, met à jour le sélecteur et réapplique les styles et couleurs.

#### c) Changement de vue (ligne ~253-262)
Appelle `restoreColumnSizeAfterViewChange()` après le changement de mode

#### d) Sortie plein écran (ligne ~265-275)
Appelle `restoreColumnSizeAfterViewChange()` à la sortie du plein écran

#### e) Changement de taille (ligne ~278-307)
Sauvegarde dans localStorage lors du changement de taille

## Scénarios testés

### Scénario 1: Persistance basique
1. Ouvrir le widget
2. Changer la taille de colonne à 0.7x (Très compact)
3. Recharger la page
4. **Résultat attendu**: La taille doit rester 0.7x

### Scénario 2: Persistance entre les modes
1. Ouvrir le widget
2. Changer la taille à 0.8x (Compact)
3. Passer en "Vue Tableau plein écran"
4. Revenir en "Vue Tableau Croisé Dynamique"
5. **Résultat attendu**: La taille doit rester 0.8x après le changement de vue
6. Passer à nouveau en plein écran
7. **Résultat attendu**: La taille doit rester 0.8x

### Scénario 3: Persistance avec rechargement
1. Ouvrir le widget
2. Changer la taille à 0.5x (Minimal)
3. Passer en plein écran
4. Recharger la page
5. **Résultat attendu**: La taille doit rester 0.5x en mode plein écran
6. Quitter le plein écran
7. **Résultat attendu**: La taille doit rester 0.5x

### Scénario 4: Sélecteur synchronisé
1. Ouvrir le widget
2. Changer la taille à 0.6x
3. Passer en plein écran
4. Revenir en mode normal
5. **Résultat attendu**: Le sélecteur doit afficher 0.6x, pas 1.0x

## Mécanisme de persistance

### Priorité de chargement
1. **localStorage** (préférence locale): utilisée en priorité
2. **Grist options** (préférence globale): utilisée en secours
3. **1.0x** (défaut): valeur par défaut

### Localisation des données
- **localStorage**: `columnSizePreference` - persiste dans le navigateur local
- **Grist**: `columnSize` - persiste dans la base de données Grist

## Avantages de cette solution

1. **Persistance locale rapide**: localStorage est plus rapide que les appels Grist
2. **Fallback robuste**: Si localStorage échoue, on se rabat sur Grist
3. **Pas de perte de données**: Le changement de vue ne perd plus la préférence
4. **Synchronisation UI**: Le sélecteur est toujours synchronisé avec l'état appliqué
5. **Compatibilité**: Fonctionne indépendamment du stockage Grist

## Fichiers modifiés

- `columnSizeManager.js`: Ajout de 3 fonctions de gestion localStorage
- `index.js`: Modification du chargement initial, ajout d'une fonction de restauration et mise à jour des gestionnaires d'événements
