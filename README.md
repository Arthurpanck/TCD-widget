# Widget Tableau Croisé Dynamique (TCD) pour Grist 🇫🇷

Ce widget permet de créer un **tableau croisé dynamique** à partir des données sources de Grist, basé sur [pivottable.js](https://pivottable.js.org/examples/).

Il s'agit d'une refonte du Widget intégré désormais à GristLabs dont l'auteur original est [jperon](https://github.com/jperon)

Cette version du widget est développée par [Arthur Panckoucke](https://github.com/Arthurpanck)

### ✅ Améliorations apportées au Pivot Table Original :

- Traduction complète de l’interface en **français**
- Mise en place de **deux modes de vue** :
  - Mode Création (édition du TCD)
  - Mode Plein écran (consultation lisible)
- Amélioration de la lisibilité : **polices agrandies, meilleures couleurs**
- Suppression des options inutiles pour se concentrer sur un usage **simple et efficace**
- Libellés inspirés d’Excel : **Lignes, Colonnes, Valeur Σ**
- **Sous-totaux** : Ajouter automatiquement des lignes de sous-totaux après chaque groupe
- **Code couleur des variables** : Chaque variable reçoit une couleur unique pour meilleure lisibilité
- **Ajustement de la taille des colonnes** : De normal à ultra-compact

### 🔧 Classis Informations
This widget builds a [pivot table](https://pivottable.js.org/examples/) from the source data.

Just setting its url gives a pivot table without any row / column definition.

The settings may be adjusted by passing url parameters, for example (with data similar to [this example](https://pivottable.js.org/examples/mps_agg.html)):
