# Changelog - Ajout des Sous-Totaux

## Version 1.1.0 - Sous-totaux Implémentés

### Nouvelles Fonctionnalités

#### 1. Système de Sous-Totaux Automatiques
- **Ajout de lignes de sous-totaux** après chaque groupe dans le tableau pivot
- **Calcul automatique des sommes** pour chaque groupe
- **Mise à jour en temps réel** lors de modifications de la configuration du pivot
- **Mode plein écran compatible** - les sous-totaux se répliquent correctement

#### 2. Interface Utilisateur
- **Case à cocher "Afficher les sous-totaux"** dans la barre de contrôle
- **Libellé des sous-totaux** : "Subtotal: [valeur du groupe]"
- **Styles distincts** pour différenciation visuelle claire
- **Support du mode sombre** avec couleurs adaptées

#### 3. Persistance des Paramètres
- **État mémorisé** dans les options Grist
- **Restauration automatique** au rechargement
- **Synchronisation** entre les différentes vues

### Fichiers Créés

#### `subtotalsManager.js` (244 lignes)
Module de gestion complet des sous-totaux :
- Activation/désactivation
- Regroupement des lignes
- Création des lignes de sous-totaux
- Calcul et formatage des valeurs
- Gestion du DOM

**Fonctions publiques:**
- `addSubtotalsToTable(config)` - Ajouter les sous-totaux
- `addSubtotalsToFullscreenTable(config)` - Ajouter au mode plein écran
- `setSubtotalsEnabled(enabled)` - Activer/désactiver
- `isSubtotalsEnabled()` - Vérifier l'état
- `resetSubtotals()` - Réinitialiser

### Fichiers Modifiés

#### `index.html`
```html
<!-- Ajouts -->
<input type="checkbox" id="subtotals-checkbox" />
Afficher les sous-totaux

<!-- Script ajouté -->
<script src="subtotalsManager.js"></script>
```

#### `index.js`
**Ajouts:**
- Nouvelle variable globale: `let subtotalsEnabledState = false;`
- Chargement de l'état initial depuis Grist
- Intégration dans `checkPivotTableAndApplyFullscreen()`
- Intégration dans le callback `onRefresh()`
- Gestionnaire d'événement pour la case à cocher
- Sauvegarde de l'état dans Grist

**Lignes modifiées:** ~60 lignes ajoutées

#### `styles.css`
**Nouvelles classes CSS:**
- `.subtotal-row` - Style de la ligne
- `.subtotal-cell` - Style des cellules
- `.subtotal-label` - Label du groupe
- `.subtotal-value` - Valeurs numériques

**Adaptations:**
- Styles pour le mode sombre
- Support de toutes les tailles de colonnes
- Style de la case à cocher

**Lignes ajoutées:** ~50 lignes

### Documentation Créée

#### `IMPLEMENTATION_SUBTOTALS.md`
Documentation technique complète :
- Architecture détaillée
- Algorithmes et logique
- Points d'intégration
- Flux de traitement
- Limitations connues

#### `GUIDE_SUBTOTALS.md`
Guide utilisateur :
- Comment activer/désactiver
- Exemple visuel
- Cas d'usage courants
- Dépannage
- Conseils d'utilisation

#### `CHANGELOG_SUBTOTALS.md`
Ce fichier

### Détails Techniques

#### Algorithme de Regroupement
1. Scan du premier niveau de lignes du corps du tableau
2. Détection de changements de groupe
3. Isolation des lignes de totaux existants
4. Création de groupes d'indices

#### Algorithme de Calcul
1. Parcours des cellules du groupe
2. Extraction des valeurs numériques
3. Somme et formatage à 2 décimales
4. Insertion de la ligne après le dernier élément du groupe

#### Performance
- Délai de 150ms avant traitement (debounce)
- Comparaison de config pour éviter les calculs redondants
- Insertion en sens inverse pour éviter les décalages d'indices

### Compatibilité

- **pivottable.js:** v2.23.0 ✓
- **jQuery:** 3.6.1+ ✓
- **jQuery UI:** 1.13.2+ ✓
- **Mode sombre:** ✓ Entièrement supporté
- **Responsive:** ✓ Toutes les tailles de colonnes

### Tests et Validation

#### Validé pour
- Activation/désactivation des sous-totaux
- Modification de rows/cols/vals avec mise à jour
- Mode pivot et mode plein écran
- Changement de taille de colonnes
- Basculement mode clair/sombre
- Persistance après refresh
- Calculs avec différents agrégateurs

#### À tester
- Très grandes tables (>10000 lignes)
- Agrégations personnalisées
- Configurations complexes multi-niveaux

### Notes de Migration

Pas de breaking change. L'implémentation est entièrement rétrocompatible :
- Les fichiers existants restent identiques (excepté les ajouts)
- Les anciens widgets continueront de fonctionner sans modification
- Opt-in : désactivé par défaut

### Fichiers Modifiés - Récapitulatif

| Fichier | Statut | Type de Changement |
|---------|--------|-------------------|
| index.html | Modified | Ajout UI + Script |
| index.js | Modified | Intégration logique |
| styles.css | Modified | Styles nouvelles |
| subtotalsManager.js | Created | Nouveau module |
| IMPLEMENTATION_SUBTOTALS.md | Created | Documentation |
| GUIDE_SUBTOTALS.md | Created | Guide utilisateur |
| CHANGELOG_SUBTOTALS.md | Created | Ce fichier |
| README.md | Modified | Référence nouvelle fonction |

### Taille du Code

- **subtotalsManager.js:** 244 lignes
- **index.js modifications:** 60 lignes supplémentaires
- **styles.css modifications:** 50 lignes supplémentaires
- **Documentation:** 600+ lignes

**Total:** ~950 lignes de code + documentation

### Prochaines Améliorations Possibles

1. **Sous-totaux multi-niveaux** - Support de hiérarchies imbriquées
2. **Sous-totaux personnalisés** - Support d'autres calculs (Count, Moyenne, Min, Max)
3. **Options de formatage** - Couleurs/styles configurables
4. **Export amélioré** - Préservation du formatage en Excel
5. **Performance** - Virtualisation pour très grandes tables

### Breaking Changes

**Aucun.** Cette implémentation est 100% rétrocompatible.

### Support des Navigateurs

- Chrome/Edge: ✓ (dernières versions)
- Firefox: ✓ (dernières versions)
- Safari: ✓ (dernières versions)
- IE11: ✗ (non supporté)

### Remerciements

Implémentation basée sur :
- pivottable.js 2.23.0
- Architecture Grist Widget
- Conventions de style existantes
