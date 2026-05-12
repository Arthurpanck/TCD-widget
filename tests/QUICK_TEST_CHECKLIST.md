# Checklist de test rapide - Persistance du columnSize

## Pré-requis
- Widget TCD ouvert dans Grist
- Console de développement accessible (F12)
- Données de tableau croisé dynamique chargées

## Test 1: Persistance basique avec localStorage
**Objectif**: Vérifier que la taille est sauvegardée dans localStorage

### Étapes
```
1. Ouvrir la console du navigateur (F12)
2. Exécuter: localStorage.getItem('columnSizePreference')
   → Résultat: null (pas encore enregistré)
3. Dans le widget, changer la taille à "0.8x - Compact"
4. Exécuter à nouveau: localStorage.getItem('columnSizePreference')
   → ✓ ATTENDU: "0.8"
5. Changer la taille à "0.5x - Minimal"
6. Vérifier: localStorage.getItem('columnSizePreference')
   → ✓ ATTENDU: "0.5"
```

## Test 2: Restauration après changement de mode
**Objectif**: Vérifier que la taille ne se réinitialise pas lors du changement de vue

### Étapes
```
1. Dans le widget, sélectionner "0.7x - Très compact"
   → Vérifier que la taille s'applique visuellement
2. Ouvrir la console et confirmer: localStorage.getItem('columnSizePreference') === "0.7"
3. Dans le widget, cliquer sur le sélecteur de vue
4. Sélectionner "Vue Tableau plein écran"
   → AVANT (BUG): La taille revenait à 1.0x
   → APRÈS (FIXE): La taille reste 0.7x
5. Vérifier le sélecteur de taille: doit afficher "0.7x - Très compact"
6. Vérifier visuellement: les colonnes doivent rester 0.7x
7. Cliquer sur le bouton "Quitter le mode plein écran"
   → La taille doit rester 0.7x
8. Vérifier le sélecteur: doit afficher "0.7x - Très compact"
```

## Test 3: Multiple mode switches
**Objectif**: Vérifier la persistance sur plusieurs changements de mode

### Étapes
```
1. Sélectionner "0.6x - Ultra compact"
2. Passer en plein écran → Vérifier 0.6x
3. Revenir en mode normal → Vérifier 0.6x
4. Changer à "0.9x - Légèrement réduit"
5. Passer en plein écran → Vérifier 0.9x
6. Revenir en mode normal → Vérifier 0.9x
7. Passer en plein écran → Vérifier 0.9x
8. Quitter plein écran → Vérifier 0.9x

→ ✓ ATTENDU: La taille doit rester stable à chaque étape
```

## Test 4: Rechargement de page
**Objectif**: Vérifier la persistance après rechargement de page

### Étapes
```
1. Sélectionner "0.75x" (ou toute autre taille)
2. Passer en mode plein écran
3. Recharger la page (F5 ou Ctrl+R)
4. Attendre le chargement complet du widget
   → ✓ ATTENDU: La vue doit être en plein écran ET la taille 0.75x
5. Vérifier le sélecteur de taille: doit afficher "0.75x"
6. Vérifier visuellement: colonnes doivent être 0.75x
7. Quitter le plein écran
   → ✓ ATTENDU: Revenir en mode normal AVEC la taille 0.75x
```

## Test 5: Synchronisation du sélecteur
**Objectif**: Vérifier que le sélecteur reste synchronisé avec la taille appliquée

### Étapes
```
1. Sélectionner "0.8x - Compact"
2. Vérifier visuellement: colonnes compactées
3. Vérifier le sélecteur: doit afficher "0.8x"
4. Passer en plein écran
   → Vérifier le sélecteur: doit TOUJOURS afficher "0.8x" (PAS 1.0x)
5. Revenir en mode normal
   → Vérifier le sélecteur: doit TOUJOURS afficher "0.8x"
6. Changer à "0.4x - Micro"
7. Passer en plein écran
   → Sélecteur doit afficher "0.4x"
   → Colonnes doivent visuellement être 0.4x
```

## Test 6: Vérification console (debug)
**Objectif**: Vérifier le fonctionnement interne

### Étapes
```
1. Ouvrir la console (F12)
2. Exécuter: console.log(localStorage.getItem('columnSizePreference'))
   → Note la valeur actuelle
3. Dans le widget, changer la taille
4. Exécuter: console.log(localStorage.getItem('columnSizePreference'))
   → ✓ ATTENDU: Affiche la nouvelle valeur
5. Changer de mode
6. Exécuter: console.log($('#column-size-select').val())
   → ✓ ATTENDU: Affiche la valeur sauvegardée (pas "1.0")
```

## Test 7: Comportement par défaut
**Objectif**: Vérifier que 1.0x fonctionne comme par défaut

### Étapes
```
1. Ouvrir la console et exécuter:
   localStorage.removeItem('columnSizePreference')
2. Recharger la page (F5)
3. Le widget doit charger avec la taille par défaut
4. Vérifier le sélecteur: doit afficher "1.0x - Normal"
5. Sélectionner une autre taille (ex: 0.7x)
6. Revenir à "1.0x - Normal"
7. Passer en plein écran
   → Doit rester 1.0x
8. Revenir en normal
   → Doit rester 1.0x
```

## Test 8: Mode fullscreen avec rechargement
**Objectif**: Vérifier la persistance en plein écran après rechargement

### Étapes
```
1. Sélectionner "0.65x"
2. Passer en plein écran
3. Recharger la page (F5)
4. Attendre le chargement complet
   → ✓ ATTENDU: Chargement directement en plein écran avec 0.65x
5. Quitter le plein écran
   → ✓ ATTENDU: Revenir en mode normal avec 0.65x
6. Recharger la page (F5)
   → ✓ ATTENDU: Charger en mode normal avec 0.65x
```

## Points d'observation importants

### À vérifier visuellement
- [ ] Les colonnes du tableau changent de largeur/hauteur
- [ ] Le texte et le padding se redimensionnent
- [ ] Le sélecteur de taille affiche la valeur correcte
- [ ] Le tableau en plein écran affiche la même taille que le mode normal
- [ ] Les couleurs sont réappliquées après les changements

### À vérifier dans la console
- [ ] localStorage.getItem('columnSizePreference') retourne la bonne valeur
- [ ] Pas de messages d'erreur en rouge
- [ ] Les logs montrent les bonnes valeurs lors des changements

### À vérifier en réseau (F12 > Network)
- [ ] Les appels Grist pour saveOption persistent
- [ ] Pas de requêtes répétées indéfiniment

## Cas limites

### Test 9: localStorage indisponible (Edge case)
```
1. Ouvrir console
2. Exécuter: delete window.localStorage
3. Dans le widget, changer la taille à 0.8x
   → ✓ ATTENDU: Fonctionne, utilise Grist en fallback
4. Passer en plein écran et revenir
   → ✓ ATTENDU: Taille maintenue (via Grist)
```

### Test 10: Rapidité des changements
```
1. Rapidement: Changer taille → Plein écran → Normal → Autre taille
   → ✓ ATTENDU: Pas d'incohérence, pas de crash
   → ✓ ATTENDU: UI reste responsive
```

## Résultats attendus - Résumé

| Test | Résultat attendu |
|------|-----------------|
| Test 1 | localStorage contient la taille sélectionnée |
| Test 2 | Taille stable pendant changements de mode |
| Test 3 | Taille stable sur >2 changements de mode |
| Test 4 | Taille restaurée après rechargement |
| Test 5 | Sélecteur toujours synchronisé avec état réel |
| Test 6 | Console shows correct values |
| Test 7 | 1.0x fonctionne comme par défaut |
| Test 8 | Plein écran persiste avec rechargement |
| Test 9 | Fallback Grist si localStorage échoue |
| Test 10 | Pas de crash, UI responsive |

## Commandes rapides pour la console

```javascript
// Voir la taille sauvegardée
localStorage.getItem('columnSizePreference')

// Voir la valeur du sélecteur
$('#column-size-select').val()

// Nettoyer localStorage
localStorage.removeItem('columnSizePreference')

// Voir tout le localStorage
console.table(JSON.parse(JSON.stringify(localStorage)))

// Restaurer manuellement une taille
localStorage.setItem('columnSizePreference', '0.8')

// Voir le mode actuel
console.log('Mode:', currentViewMode)
```

## Notes pour les testeurs

1. **Avant et Après**: Ce widget avait un bug de réinitialisation de taille lors du changement de mode. Cette implémentation l'a fixé.

2. **localStorage vs Grist**: 
   - localStorage est local au navigateur/domaine
   - Grist est global à l'espace de travail
   - Les deux sont utilisés en cascade pour maximiser la robustesse

3. **Timing**: Certains changements ont des délais (setTimeout) pour permettre au DOM de se mettre à jour

4. **Rechargement**: Le premier test après rechargement peut prendre quelques secondes pour que Grist se charge

## Questions de diagnostic

Si un test échoue, poser ces questions:

1. **Quelle taille affiche le sélecteur?** → localStorage ou défaut?
2. **Quelle taille visuelle a le tableau?** → 0.8x ou 1.0x?
3. **Quel mode d'affichage?** → Normal ou plein écran?
4. **Qu'affiche la console?** → Erreurs? Warnings?
5. **localStorage vide?** → localStorage.getItem('columnSizePreference')
6. **Grist accessible?** → Pas d'erreurs dans Network?
