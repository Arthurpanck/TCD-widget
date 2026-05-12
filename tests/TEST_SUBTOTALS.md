# Plan de Test - Fonctionnalité Sous-Totaux

## Tests Manuels à Exécuter

### 1. Activation/Désactivation Basique

#### Test 1.1: Case à Cocher Visible
- **Action:** Ouvrir le widget Pivot Table
- **Attendre:** Barre de contrôle s'affiche
- **Vérifier:** Case "Afficher les sous-totaux" présente
- **Résultat attendu:** ✓ Checkbox visible et fonctionnel

#### Test 1.2: Activation
- **Action:** Cocher la case "Afficher les sous-totaux"
- **Attendre:** 200ms
- **Vérifier:** Lignes de sous-totaux apparaissent
- **Résultat attendu:** ✓ Sous-totaux visibles dans le tableau

#### Test 1.3: Désactivation
- **Action:** Décocher la case
- **Attendre:** 100ms
- **Vérifier:** Toutes les lignes de sous-totaux disparaissent
- **Résultat attendu:** ✓ Tableau revient à l'état normal

---

### 2. Affichage et Styles

#### Test 2.1: Apparence des Sous-Totaux
- **Configuration:** Rows: un champ, Cols: un champ, Values: un champ
- **Action:** Cocher les sous-totaux
- **Vérifier:** Chaque ligne de sous-total :
  - [ ] Fond gris distinctif
  - [ ] Texte en italique
  - [ ] Bordure supérieure épaisse
  - [ ] Libellé "Subtotal: [valeur]"
- **Résultat attendu:** ✓ Tous les éléments visuels présents

#### Test 2.2: Libellé de Groupe
- **Action:** Observer le texte du sous-total
- **Vérifier:** Format "Subtotal: [valeur du groupe]" correct
- **Exemple:** "Subtotal: France", "Subtotal: Q1", etc.
- **Résultat attendu:** ✓ Libellé lisible et cohérent

#### Test 2.3: Positionnement
- **Vérifier:** Les sous-totaux s'ajoutent immédiatement après chaque groupe
- **Résultat attendu:** ✓ Placement logique et cohérent

---

### 3. Calculs et Valeurs

#### Test 3.1: Somme Correcte
- **Configuration:** Values: un champ numérique avec Sum
- **Action:** Cocher les sous-totaux
- **Vérifier:** Pour chaque groupe, la somme = somme des lignes du groupe
- **Exemple:** Si Apple: 100, 120, 140 → Subtotal: 360
- **Résultat attendu:** ✓ Calculs arithmétiquement exacts

#### Test 3.2: Valeurs Non-Numériques
- **Configuration:** Values: un champ avec texte
- **Action:** Cocher les sous-totaux
- **Vérifier:** Les valeurs texte sont traitées comme 0
- **Résultat attendu:** ✓ Pas d'erreur JavaScript, affichage gracieux

#### Test 3.3: Format Décimal
- **Configuration:** Values: champ avec décimales
- **Action:** Cocher les sous-totaux
- **Vérifier:** Résultats affichés avec 2 décimales
- **Résultat attendu:** ✓ Format cohérent (ex: 1234.56)

#### Test 3.4: Arrondi
- **Configuration:** Valeur qui produit 1.5555 en somme
- **Vérifier:** Affichage arrondi à 1.56
- **Résultat attendu:** ✓ Arrondi mathématique correct

---

### 4. Interactions avec Modifications

#### Test 4.1: Modification de Rows
- **Action:** 
  1. Activer les sous-totaux
  2. Changer le champ Rows
  3. Attendre le refresh
- **Vérifier:** Nouveaux sous-totaux générés correctement
- **Résultat attendu:** ✓ Mise à jour automatique sans erreur

#### Test 4.2: Modification de Cols
- **Action:** 
  1. Sous-totaux actifs
  2. Changer le champ Columns
  3. Attendre le refresh
- **Vérifier:** Sous-totaux ajustés au nombre de colonnes
- **Résultat attendu:** ✓ Nombre de cellules correct

#### Test 4.3: Modification de Values
- **Action:**
  1. Sous-totaux actifs
  2. Ajouter/retirer une valeur
- **Vérifier:** Sous-totaux recalculés
- **Résultat attendu:** ✓ Valeurs correctes pour le nouvel agrégateur

#### Test 4.4: Changement d'Agrégateur
- **Configuration:** Values avec Count, Sum, Average, etc.
- **Action:** 
  1. Activer les sous-totaux
  2. Changer d'agrégateur (ex: Sum → Count)
- **Vérifier:** Les calculs changent correctement
- **Résultat attendu:** ✓ Agrégateur appliqué aux sous-totaux

---

### 5. Mode Plein Écran

#### Test 5.1: Sous-Totaux en Plein Écran
- **Action:**
  1. Activer les sous-totaux
  2. Passer en "Vue Tableau plein écran"
- **Vérifier:** Sous-totaux présents dans la vue plein écran
- **Résultat attendu:** ✓ Même lignes avec même formatage

#### Test 5.2: Synchronisation Plein Écran
- **Action:**
  1. Mode plein écran actif avec sous-totaux
  2. Modifier la configuration du pivot
  3. Attendre le refresh
- **Vérifier:** Sous-totaux dans le plein écran mis à jour
- **Résultat attendu:** ✓ Synchronisation correcte

#### Test 5.3: Basculement Mode
- **Action:**
  1. Activer plein écran + sous-totaux
  2. Revenir au mode pivot
  3. Les sous-totaux doivent rester actifs
- **Résultat attendu:** ✓ État préservé lors du changement de mode

---

### 6. Taille des Colonnes

#### Test 6.1: Sous-Totaux avec Petites Colonnes
- **Action:**
  1. Définir taille colonnes à 0.5x
  2. Activer les sous-totaux
- **Vérifier:** Sous-totaux visibles et lisibles
- **Résultat attendu:** ✓ Pas de débordement, texte visible

#### Test 6.2: Sous-Totaux avec Grandes Colonnes
- **Action:**
  1. Définir taille colonnes à 1.0x
  2. Activer les sous-totaux
- **Vérifier:** Spacing et alignement corrects
- **Résultat attendu:** ✓ Proportions esthétiques

#### Test 6.3: Changement de Taille en Cours
- **Action:**
  1. Sous-totaux actifs
  2. Changer la taille des colonnes
- **Vérifier:** Sous-totaux restent visibles et correctement alignés
- **Résultat attendu:** ✓ Adaptation dynamique

---

### 7. Persistance

#### Test 7.1: Mémorisation de l'État
- **Action:**
  1. Activer les sous-totaux
  2. Rafraîchir la page (F5)
  3. Attendre le chargement
- **Vérifier:** Case reste cochée et sous-totaux réapparaissent
- **Résultat attendu:** ✓ État persisté dans Grist

#### Test 7.2: Basculement Persistant
- **Action:**
  1. Cocher les sous-totaux
  2. Décocher
  3. Rafraîchir
- **Vérifier:** Case restée décochée
- **Résultat attendu:** ✓ Dernier état mémorisé

---

### 8. Mode Sombre

#### Test 8.1: Couleurs en Mode Sombre
- **Action:**
  1. Activer mode sombre système
  2. Activer les sous-totaux
- **Vérifier:** 
  - [ ] Fond adapté au thème sombre
  - [ ] Texte lisible
  - [ ] Contraste suffisant
  - [ ] Bordures visibles
- **Résultat attendu:** ✓ Tous les éléments adaptés

#### Test 8.2: Basculement Clair/Sombre
- **Action:**
  1. Sous-totaux actifs
  2. Basculer le mode sombre
- **Vérifier:** Couleurs changent instantanément
- **Résultat attendu:** ✓ Transition fluide

---

### 9. Cas Limites

#### Test 9.1: Tableau Vide
- **Action:** Tableau sans données
- **Vérifier:** Pas d'erreur, pas de ligne de sous-total
- **Résultat attendu:** ✓ Affichage gracieux

#### Test 9.2: Un Seul Groupe
- **Configuration:** Une seule valeur dans Rows
- **Vérifier:** Un seul sous-total s'affiche
- **Résultat attendu:** ✓ Logique correcte

#### Test 9.3: Beaucoup de Colonnes
- **Configuration:** Rows avec 10+ colonnes
- **Vérifier:** Sous-totaux couvrent toutes les colonnes
- **Résultat attendu:** ✓ Gestion correcte de largeur

#### Test 9.4: Valeurs Très Grandes
- **Configuration:** Values avec nombres > 1000000
- **Vérifier:** Formatage et calculs corrects
- **Résultat attendu:** ✓ Pas de dépassement d'entier

#### Test 9.5: Valeurs Très Petites
- **Configuration:** Values avec décimales (0.001, etc.)
- **Vérifier:** Arrondi correct à 2 décimales
- **Résultat attendu:** ✓ Précision maintenue

---

### 10. Performance

#### Test 10.1: Tableau Moyen (500 lignes)
- **Mesure:** Temps d'activation des sous-totaux
- **Attendre:** < 500ms
- **Résultat attendu:** ✓ Réactif

#### Test 10.2: Grand Tableau (1000+ lignes)
- **Mesure:** Temps d'activation + modification
- **Vérifier:** Pas de gel de l'interface
- **Résultat attendu:** ✓ Performance acceptable

#### Test 10.3: Modification Rapide
- **Action:** Modifier rapidement rows/cols/vals
- **Vérifier:** Pas de calculs dupliqués, pas de lag
- **Résultat attendu:** ✓ Debounce fonctionne

---

### 11. Interaction avec Autres Fonctionnalités

#### Test 11.1: Couleurs de Variables
- **Action:**
  1. Sous-totaux actifs
  2. Variables colorisées (ColorManager)
- **Vérifier:** Les couleurs ne s'appliquent pas aux sous-totaux
- **Résultat attendu:** ✓ Pas de conflit visuel

#### Test 11.2: Export de Données
- **Action:**
  1. Sous-totaux actifs
  2. Exporter (si applicable)
- **Vérifier:** Sous-totaux inclus dans l'export
- **Résultat attendu:** ✓ Cohérence des données

#### Test 11.3: Filtre (si disponible)
- **Action:**
  1. Appliquer un filtre
  2. Sous-totaux actifs
- **Vérifier:** Sous-totaux recalculés sur données filtrées
- **Résultat attendu:** ✓ Logique cohérente

---

## Checklist de Validation

### Code Quality
- [ ] Pas d'erreurs JavaScript dans la console
- [ ] Pas d'avertissements (warnings) critiques
- [ ] Code lisible et commenté
- [ ] Pas de variables globales polluantes

### Fonctionnalité
- [ ] Activation/désactivation fonctionne
- [ ] Calculs corrects
- [ ] Mise à jour automatique
- [ ] Mode plein écran compatible

### UI/UX
- [ ] Case à cocher visible et accessible
- [ ] Styles distincts et reconnaissables
- [ ] Mode sombre supporté
- [ ] Responsive sur différentes tailles

### Performance
- [ ] < 300ms pour activation
- [ ] < 500ms pour update sur 1000 lignes
- [ ] Pas de lag visible

### Persistance
- [ ] État mémorisé après refresh
- [ ] Sauvegarde correcte dans Grist

---

## Rapport de Test

### À Compléter Après Tests

```
Date: _______________
Testeur: _______________
Version: _______________

Tests Réussis: ___ / 60
Bugs Trouvés: ___

Issues Critiques:
- [ ] Aucun

Issues Mineures:
- [ ] Aucun

Suggestions:
- Aucune

Conclusion: PASS / FAIL
```

---

## Procédure en Cas d'Erreur

Si vous rencontrez une erreur :

1. **Note l'erreur exacte** (console.error)
2. **Note les étapes** pour la reproduire
3. **Vérifiez les conditions** (taille tableau, type données, etc.)
4. **Consultez** IMPLEMENTATION_SUBTOTALS.md
5. **Créez un ticket** avec tous les détails

Merci pour vos tests !
