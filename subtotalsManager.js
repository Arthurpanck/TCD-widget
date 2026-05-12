/**
 * Gestionnaire de sous-totaux pour tableaux croisés dynamiques
 * @fileoverview Ajoute des lignes de sous-totaux après chaque groupe dans une table pivot
 * @version 1.0.0
 */

let subtotalsEnabled = false;
let lastSubtotalsConfig = null;

/**
 * Récupère la valeur numérique d'une cellule
 * @param {HTMLElement} cell - Cellule du tableau
 * @returns {number} Valeur numérique ou 0
 */
function getCellNumericValue(cell) {
  const text = $(cell).text().trim();
  const num = parseFloat(text.replace(/,/g, '.'));
  return isNaN(num) ? 0 : num;
}

/**
 * Vérifie si une cellule contient un total
 * @param {HTMLElement} cell - Cellule du tableau
 * @returns {boolean} True si la cellule est un total
 */
function isTotalCell(cell) {
  const $cell = $(cell);
  return $cell.hasClass('pvtTotal') ||
         $cell.hasClass('pvtTotalLabel') ||
         $cell.hasClass('pvtGrandTotal') ||
         $cell.text().toLowerCase().includes('total');
}

/**
 * Ajoute des sous-totaux au tableau pivot
 * @param {Object} config - Configuration avec rows, cols, vals, aggregatorName
 */
function addSubtotalsToTable(config) {
  if (!subtotalsEnabled) {
    return;
  }

  const $table = $('#table').find('table.pvtTable');
  if ($table.length === 0) {
    return;
  }

  // Éviter les appels multiples rapides
  if (lastSubtotalsConfig === JSON.stringify(config)) {
    return;
  }
  lastSubtotalsConfig = JSON.stringify(config);

  // Utiliser setTimeout pour laisser le temps au pivot table de se rendre
  setTimeout(() => {
    processTableForSubtotals($table, config);
  }, 150);
}

/**
 * Traite le tableau pour ajouter les sous-totaux
 * @param {jQuery} $table - Élément jQuery du tableau
 * @param {Object} config - Configuration du pivot table
 */
function processTableForSubtotals($table, config) {
  // Supprimer les sous-totaux existants
  $table.find('tr.subtotal-row').remove();

  const $rows = $table.find('tbody tr');
  if ($rows.length === 0) {
    return;
  }

  // Regrouper les lignes par clés de groupe
  const groups = groupRowsByFirstColumn($rows);

  // Pour chaque groupe, ajouter une ligne de sous-total
  // On doit insérer en sens inverse pour ne pas décaler les indices
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    const rows = group.rows;
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1];
      const subtotalRow = createSubtotalRow($table, lastRow, rows, config);
      $(lastRow).after(subtotalRow);
    }
  }

  // Appliquer les styles et couleurs
  applySubtotalStyles($table);
}

/**
 * Regroupe les lignes par la valeur de la première colonne (niveau de ligne)
 * Cela crée des groupes pour chaque changement de valeur
 * @param {jQuery} $rows - Toutes les lignes du tableau
 * @returns {Array} Array de groupes avec rows et lastRowIndex
 */
function groupRowsByFirstColumn($rows) {
  const groups = [];
  let currentGroup = null;
  let currentGroupRows = [];
  let currentGroupIndex = 0;

  $rows.each(function(index) {
    // Vérifier si c'est une ligne de total (elle aura un fond bleu clair)
    const $firstCell = $(this).find('td, th').first();
    const firstCellText = $firstCell.text().trim();
    const isTotal = isTotalCell(this);

    // Si c'est un total, créer un groupe si nécessaire
    if (isTotal) {
      if (currentGroupRows.length > 0) {
        groups.push({
          rows: currentGroupRows,
          lastRowIndex: index - 1
        });
        currentGroupRows = [];
        currentGroup = null;
      }
      return;
    }

    // Déterminer le groupe: si c'est un changement de groupe ou le premier
    if (!currentGroup || currentGroup !== firstCellText) {
      // Sauvegarder le groupe précédent
      if (currentGroupRows.length > 0) {
        groups.push({
          rows: currentGroupRows,
          lastRowIndex: index - 1
        });
      }
      currentGroup = firstCellText;
      currentGroupRows = [];
    }

    currentGroupRows.push(this);
  });

  // Ajouter le dernier groupe
  if (currentGroupRows.length > 0) {
    groups.push({
      rows: currentGroupRows,
      lastRowIndex: $rows.length - 1
    });
  }

  return groups;
}

/**
 * Crée une ligne de sous-total
 * @param {jQuery} $table - Élément jQuery du tableau
 * @param {HTMLElement} lastRow - Dernière ligne du groupe
 * @param {Array} rows - Toutes les lignes du groupe
 * @param {Object} config - Configuration du pivot table
 * @returns {jQuery} Ligne de sous-total créée
 */
function createSubtotalRow($table, lastRow, rows, config) {
  const $lastRow = $(lastRow);
  const $firstRow = $(rows[0]);

  // Créer une nouvelle ligne
  const $subtotalRow = $('<tr class="subtotal-row"></tr>');

  // Obtenir les cellules de la première ligne du groupe
  const $firstCells = $firstRow.find('td, th');

  // Créer les cellules du sous-total
  $firstCells.each(function(index) {
    const $cell = $(this);
    const $subtotalCell = $('<td class="subtotal-cell"></td>');

    // La première colonne affiche "Sous-total: [valeur]"
    if (index === 0) {
      const firstCellValue = $firstRow.find('td, th').first().text().trim();
      $subtotalCell.addClass('subtotal-label');
      $subtotalCell.text(`Subtotal: ${firstCellValue}`);
      $subtotalCell.attr('colspan', '1');
    } else {
      // Pour les colonnes de valeurs, calculer la somme
      let sum = 0;
      rows.forEach(row => {
        const cellValue = getCellNumericValue($(row).find('td, th').eq(index));
        sum += cellValue;
      });

      // Formater le nombre avec deux décimales
      $subtotalCell.text((Math.round(sum * 100) / 100).toFixed(2));
      $subtotalCell.addClass('subtotal-value');
    }

    $subtotalRow.append($subtotalCell);
  });

  return $subtotalRow;
}

/**
 * Applique les styles CSS aux lignes de sous-totaux
 * @param {jQuery} $table - Élément jQuery du tableau
 */
function applySubtotalStyles($table) {
  $table.find('tr.subtotal-row').each(function() {
    $(this).find('td').each(function() {
      $(this).addClass('subtotal-cell');
    });
  });
}

/**
 * Active/désactive les sous-totaux
 * @param {boolean} enabled - État souhaité
 */
function setSubtotalsEnabled(enabled) {
  subtotalsEnabled = enabled;

  // Si on désactive, supprimer toutes les lignes de sous-totaux
  if (!enabled) {
    $('#table').find('tr.subtotal-row').remove();
    $('#fullscreen-table-container').find('tr.subtotal-row').remove();
    lastSubtotalsConfig = null;
  }
}

/**
 * Retourne l'état des sous-totaux
 * @returns {boolean} État des sous-totaux
 */
function isSubtotalsEnabled() {
  return subtotalsEnabled;
}

/**
 * Réinitialise le gestionnaire de sous-totaux
 */
function resetSubtotals() {
  lastSubtotalsConfig = null;
  setSubtotalsEnabled(false);
}

/**
 * Ajoute les sous-totaux au tableau en mode plein écran
 */
function addSubtotalsToFullscreenTable(config) {
  if (!subtotalsEnabled) {
    return;
  }

  const $table = $('#fullscreen-table-container').find('table.pvtTable');
  if ($table.length === 0) {
    return;
  }

  setTimeout(() => {
    processTableForSubtotals($table, config);
  }, 150);
}

// Exports pour différents environnements
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addSubtotalsToTable,
    setSubtotalsEnabled,
    isSubtotalsEnabled,
    resetSubtotals,
    addSubtotalsToFullscreenTable
  };
} else if (typeof window !== 'undefined') {
  window.SubtotalsManager = {
    addSubtotalsToTable,
    setSubtotalsEnabled,
    isSubtotalsEnabled,
    resetSubtotals,
    addSubtotalsToFullscreenTable
  };
}
