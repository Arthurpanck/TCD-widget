# Démarrage Rapide - Design DSFR

## Ce qui a changé

Le widget Grist a été transformé pour respecter les standards du Système de Design de l'État Français (DSFR).

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| `index.html` | Structure HTML avec CDN DSFR et aria-labels |
| `styles.css` | Styles DSFR avec variables CSS et polices Marianne |
| `DSFR_IMPLEMENTATION.md` | Documentation complète |
| `DSFR_CHECKLIST.md` | Checklist de conformité |
| `DSFR_CHANGES_SUMMARY.txt` | Résumé détaillé des modifications |

## Couleurs officielles

```css
--primary-color: #000091       /* Bleu France */
--success-color: #18753c       /* Vert */
--danger-color: #ce0500        /* Rouge */
--secondary-color: #6c757d     /* Gris */
```

## Points clés

1. **CDN DSFR chargé** depuis jsDelivr (v1.9.7)
2. **Police Marianne** avec fallback Arial
3. **Espacements** en grille 8px
4. **Bordures** arrondies à 4px
5. **Accessibilité** WCAG AA renforcée
6. **Focus states** visibles partout
7. **Mode sombre** automatique (prefers-color-scheme)
8. **Responsive** sur tous les appareils

## Validation rapide

Pour vérifier que tout fonctionne :

```bash
# Vérifier le CDN DSFR
grep "dsfr.min.css" index.html

# Vérifier la police Marianne
grep "Marianne" styles.css | wc -l

# Vérifier les couleurs DSFR
grep "#000091\|#18753c\|#ce0500" styles.css

# Vérifier les aria-labels
grep "aria-label" index.html | wc -l
```

## Accessibilité

- Focus visible sur tous les éléments interactifs
- Aria-labels sur tous les contrôles
- Contraste WCAG AA minimum
- Boutons 44x44px (tactile-friendly)
- Navigation complète au clavier

## Mode sombre

S'active automatiquement selon les préférences système:
- Windows: Paramètres > Personnalisation > Couleurs
- macOS: Préférences Système > Apparence
- Linux: Dépend du gestionnaire de fenêtres

## FAQ

**Q: Les couleurs ne changent pas?**
A: Vérifiez que le CDN DSFR se charge. Ouvrez l'inspecteur (F12) et cherchez le CSS DSFR dans l'onglet Réseau.

**Q: La police Marianne n'apparaît pas?**
A: Normal, elle est remplacée par Arial (fallback). La police Marianne officielle doit être installée localement.

**Q: Ça fonctionne en mode sombre?**
A: Oui, activez le mode sombre dans les paramètres de votre OS pour voir les couleurs adaptées.

**Q: Le drag & drop fonctionne toujours?**
A: Oui, toutes les fonctionnalités sont conservées.

## Ressources

- DSFR Officiel: https://www.systeme-de-design.gouv.fr/
- CDN jsDelivr: https://cdn.jsdelivr.net/npm/@gouvfr/dsfr/

## Support

Pour toute question sur l'implémentation DSFR, consultez:
1. `DSFR_IMPLEMENTATION.md` - Documentation détaillée
2. `DSFR_CHECKLIST.md` - Liste de vérification
3. `DSFR_CHANGES_SUMMARY.txt` - Modifications précises

---

Widget prêt pour les organisations gouvernementales françaises!
