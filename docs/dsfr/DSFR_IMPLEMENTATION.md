# Implémentation du Design DSFR - Système de Design de l'État Français

## Vue d'ensemble

Ce widget Grist a été mis à jour pour respecter les standards du **Système de Design de l'État Français (DSFR)**, destiné aux organisations gouvernementales françaises.

## Modifications apportées

### 1. HTML (`index.html`)

- **Ajout du CDN DSFR** :
  - CSS principal: `https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.9.7/dist/dsfr.min.css`
  - Icônes DSFR: `https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.9.7/dist/utility/icons/icons.min.css`

- **Amélioration de l'accessibilité** :
  - Ajout de `aria-label` sur tous les contrôles
  - Attribut `role="toolbar"` sur le conteneur de contrôles
  - Attributs `aria-hidden="true"` sur les SVG décoratifs
  - Viewport meta tag pour responsive design

### 2. CSS (`styles.css`)

#### Variables DSFR Officielles

```css
--primary-color: #000091;        /* Bleu officiel France */
--success-color: #18753c;        /* Vert - succès */
--danger-color: #ce0500;         /* Rouge - erreur */
--warning-color: #d4a574;        /* Beige - avertissement */
--info-color: #3a5afc;           /* Bleu info */
```

#### Changements visuels clés

- **Polices** : Remplacement par `Marianne` (police officielle DSFR)
- **Espacements** : Utilisation de variables DSFR (multiples de 8px)
  - `--spacing-xs: 4px`
  - `--spacing-sm: 8px`
  - `--spacing-md: 16px`
  - `--spacing-lg: 24px`
  - `--spacing-xl: 32px`

- **Bordures** : Réduction des rayon de bordure `border-radius: 4px` (standard DSFR)
- **Ombres** : Simplification vers les standards DSFR (plus subtiles)
- **Boutons** :
  - Hauteur minimale: 44px (touch-friendly WCAG)
  - Couleur primaire: bleu officiel #000091
  - Transition smooth sur hover

#### Amélioration WCAG AA

- Contraste des couleurs renforcé (conforme WCAG AA)
- Focus states visibles: `outline: 2px solid var(--primary-color)`
- Outlines avec `outline-offset: 2px` pour meilleure visibilité
- Checkboxes dimensionnées à 18px (minimum recommandé)

### 3. Accessibilité

#### Standards respectés

- **Clavier** : Navigation complète au clavier
- **Focus Management** : Tous les éléments interactifs ont un focus visible
- **ARIA Labels** :
  - Sélecteurs de vue et taille
  - Checkboxes (affichage sous-totaux, mode fixe)
  - Bouton fermeture plein écran
  - Barre d'outils

- **Contraste** : Ratio minimum WCAG AA (4.5:1 pour texte normal)

### 4. Mode sombre

Implémentation optionnelle du mode sombre en utilisant `prefers-color-scheme: dark`:

```css
@media (prefers-color-scheme: dark) {
  /* Couleurs adaptées pour meilleure lisibilité */
}
```

### 5. Responsivité

- **Desktop** : Layout optimisé pour grand écran
- **Tablette** (< 768px) : Adaptation du spacing et des tailles de police
- **Mobile** (< 480px) : Layout empilé vertical, touches 44x44px
- **Petit mobile** (< 320px) : Styles ultra-compacts

## Points clés de conformité

| Critère | Statut | Notes |
|---------|--------|-------|
| Couleurs DSFR | ✓ | Bleu #000091, vert #18753c, rouge #ce0500 |
| Polices | ✓ | Marianne en fallback Arial |
| Espacements | ✓ | Multiples de 8px |
| Bordures | ✓ | border-radius: 4px |
| Focus visible | ✓ | outline 2px solid |
| Contraste WCAG AA | ✓ | Minimum 4.5:1 |
| Boutons touch-friendly | ✓ | 44px min height |
| Aria labels | ✓ | Sur tous les contrôles |
| Clavier navigable | ✓ | Aucune dépendance à la souris |

## Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (modernes)
- **Mode sombre** : Détection automatique via `prefers-color-scheme`
- **Mobile** : iOS et Android (avec touch punch)
- **Accessibilité** : WCAG AA minimum

## Fonctionnalités conservées

Toutes les fonctionnalités existantes ont été préservées :

- Pivot table interactive
- Mode plein écran
- Sélection de taille de colonnes
- Sous-totaux
- Mode largeur fixe
- Export Excel
- Agrégations multiples
- Drag & drop des variables
- Filtres

## Personnalisation

Pour personnaliser les couleurs DSFR, modifier les variables CSS:

```css
:root {
  --primary-color: #000091;
  --success-color: #18753c;
  --danger-color: #ce0500;
  /* ... autres couleurs ... */
}
```

## Notes de maintenance

- Les styles PivotTable.js sont surpassés par les règles DSFR
- Les variables CSS permettent une personnalisation facile
- Le fichier styles.css est organisé par sections pour faciliter les mises à jour
- Mode sombre activé automatiquement selon les préférences système

## Ressources DSFR

- Documentation officielle: https://www.systeme-de-design.gouv.fr/
- Couleurs: https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux/couleurs
- Typographie: https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux/typographie
