# Guide d'Utilisation des Sous-Totaux

## Qu'est-ce que les sous-totaux ?

Les sous-totaux sont des lignes additionnelles dans votre tableau croisé dynamique qui affichent automatiquement la somme des valeurs pour chaque groupe de lignes. Cela facilite l'analyse rapide des données groupées.

## Comment activer les sous-totaux ?

### Étapes simples

1. **Ouvrir le widget Pivot Table dans Grist**
2. **Localiser la barre de contrôle** en haut du tableau (avec "Vue" et "Taille colonnes")
3. **Cocher la case** "Afficher les sous-totaux"
4. **Les sous-totaux apparaissent immédiatement** dans votre tableau

## Exemple Visuel

### Avant (sans sous-totaux)
```
Product   Q1    Q2    Q3
Apple     100   120   140
Banana    200   210   220
Cherry    50    60    70
```

### Après (avec sous-totaux)
```
Product   Q1    Q2    Q3
Apple     100   120   140
Subtotal: Apple  100   120   140
Banana    200   210   220
Subtotal: Banana 200   210   220
Cherry    50    60    70
Subtotal: Cherry 50    60    70
```

## Fonctionnalités Clés

### Mise à Jour Automatique
- Les sous-totaux se **mettent à jour automatiquement** quand vous modifiez :
  - Les lignes (Rows)
  - Les colonnes (Columns)
  - Les valeurs à agréger (Values)
  - Le type d'agrégation (Sum, Count, Moyenne, etc.)

### Compatible avec tous les modes

- **Mode Tableau Croisé Dynamique** : Les sous-totaux s'affichent dans la vue d'édition
- **Mode Plein Écran** : Les sous-totaux sont visibles dans la vue de consultation
- **Tous les tailles de colonnes** : De 1.0x (Normal) à 0.25x (Extrême)

### Persistance

L'état des sous-totaux est **mémorisé automatiquement** :
- Si vous cochez la case, elle restera cochée quand vous reviendrez
- Même après rafraîchir la page
- Même après fermer et rouvrir le widget

## Règles de Calcul

### Comment les sous-totaux sont-ils calculés ?

1. **Groupement** : Les lignes sont groupées par la première colonne
2. **Somme** : Toutes les valeurs numériques du groupe sont additionnées
3. **Format** : Le résultat est affiché avec 2 décimales
4. **Placement** : La ligne de sous-total s'ajoute immédiatement après le dernier élément du groupe

### Exemple avec Moyenne Pondérée

Si votre agrégation est "Moyenne pondérée", les sous-totaux :
- **Ne dupliqueront pas** la ligne de total globale
- Afficheront la **moyenne** du groupe (pas une double moyenne)
- Respecteront le type d'agrégation actif

## Différences Visuelles

### Les lignes de sous-totaux se distinguent par :

- **Fond gris clair** pour meilleure visibilité
- **Texte en italique** pour indiquer qu'il s'agit d'un calcul
- **Bordure supérieure accentuée** pour délimitation claire
- **Font plus petit** que les headers mais plus visible que les données

### En mode sombre

Les sous-totaux adaptent automatiquement leurs couleurs pour :
- Utiliser des teintes appropriées au thème sombre
- Maintenir le contraste et la lisibilité
- Conserver la distinction visuelle

## Cas d'Usage Communs

### 1. Rapport de Ventes par Région
```
Configuration:
- Lignes (Rows): Région
- Colonnes (Columns): Mois
- Valeurs: Montant des ventes

Résultat:
- Affiche le total des ventes par région pour chaque mois
- Les sous-totaux montrent le total mensuel par région
```

### 2. Analyse d'Inventaire par Catégorie
```
Configuration:
- Lignes (Rows): Catégorie de produit
- Colonnes (Columns): Entrepôt
- Valeurs: Quantité en stock

Résultat:
- Les sous-totaux indiquent le total par catégorie dans chaque entrepôt
```

### 3. Tableau de Bord RH par Département
```
Configuration:
- Lignes (Rows): Département
- Colonnes (Columns): Année
- Valeurs: Nombre d'employés

Résultat:
- Vérifiez rapidement le nombre d'employés par département annuellement
```

## Désactiver les Sous-Totaux

Pour **supprimer les sous-totaux** :
1. Décrochez la case "Afficher les sous-totaux"
2. Toutes les lignes de sous-totaux disparaissent immédiatement
3. L'état est mémorisé pour la prochaine visite

## Limitation et Considérations

### Ce que font les sous-totaux
- Sommation de valeurs numériques
- Groupement par première colonne
- Affichage rapide sans rechargement

### Ce que ne font pas les sous-totaux
- Calculs personnalisés (juste somme)
- Groupement multi-niveaux hiérarchiques
- Statistiques avancées (variance, percentile, etc.)

Pour des analyses plus complexes, vous pouvez :
- Exporter les données en Excel
- Utiliser d'autres outils d'analyse
- Créer des colonnes calculées dans Grist

## Dépannage

### Q: Les sous-totaux n'apparaissent pas
**R**: Assurez-vous que :
- La case "Afficher les sous-totaux" est bien cochée
- Au moins une valeur (Values) est configurée
- Le tableau n'est pas vide

### Q: Les chiffres semblent incorrects
**R**: 
- Vérifiez que l'agrégation active est correcte
- Les valeurs non-numériques sont ignorées
- Les décimales sont arrondies à 2 chiffres

### Q: Les sous-totaux disparaissent après un rafraîchissement
**R**:
- C'est normal - c'est une actualisation du widget
- Les paramètres sont sauvegardés et ils réapparaîtront
- Attendez quelques secondes après le rafraîchissement

### Q: Puis-je avoir des sous-totaux multi-niveaux ?
**R**: Actuellement non, mais vous pouvez :
- Utiliser plusieurs configurations de pivot table
- Créer des tableaux imbriqués dans Grist
- Cette fonctionnalité peut être ajoutée dans les versions futures

## Conseils d'Utilisation

### Pour la meilleure lisibilité
1. Ajustez la taille des colonnes (0.8x - 0.9x fonctionne bien avec les sous-totaux)
2. Limitez le nombre de colonnes pour éviter le défilement horizontal
3. Groupez logiquement avec des lignes significatives

### Performance
- Les sous-totaux se calculent très rapidement (même avec 1000+ lignes)
- Pas d'impact notable sur les performances
- Le traitement DOM reste fluide

### Exportation
Quand vous exportez votre pivot table :
- Les sous-totaux **sont inclus** dans l'export
- Ils maintiennent leur formatage visuel
- Parfait pour les rapports et présentations

## Support et Feedback

Si vous rencontrez des problèmes ou avez des suggestions :
1. Vérifiez ce guide d'utilisation
2. Consultez la documentation technique (IMPLEMENTATION_SUBTOTALS.md)
3. Contactez le support Grist
