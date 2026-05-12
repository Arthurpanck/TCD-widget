window.onerror = (err) => {
  console.trace();
  alert(String(err));
};

grist.ready({
  requiredAccess: 'read table'
});

let currentViewMode = 'pivot'; // Mode d'affichage actuel : 'pivot' (normal) ou 'fullscreen' (plein écran)
let lastPivotData = null;  // Stocke les données brutes du tableau reçues de Grist
let currentPivotConfig = {};  // Configuration du tableau (rows, cols, vals, aggregatorName, rendererName)
let pivotTableInitialized = false; // suit l'état d'initialisation du widget
let subtotalsEnabledState = false; // État des sous-totaux
let fixedWidthMode = false; // État du mode fixe
let multiAggregationEnabled = false; // État des agrégations multiples
let originalVals = []; // Stocke les champs Valeur originaux

// Fonction pour mettre à jour le tableau même lorsqu'il est en plein écran
function updateFullscreenTable() {
  const $pivotTableInUI = $('#table').find('table.pvtTable');
  const $fullscreenContainer = $('#fullscreen-table-container');
  $fullscreenContainer.empty();

  if ($pivotTableInUI.length) {
    const $clonedTable = $pivotTableInUI.clone(true, true);
    $fullscreenContainer.append($clonedTable);

    // Appliquer les couleurs au tableau cloné
    applyVariableColors();

  } else {
    // Si nous sommes en mode plein écran mais que la table n'est pas encore prête,
    // afficher un message de chargement au lieu d'un message d'erreur
    if (currentViewMode === 'fullscreen' && !pivotTableInitialized) {
      $fullscreenContainer.html('<p style="text-align:center; padding-top:50px;">Chargement du tableau en cours...</p>');
    } else {
      $fullscreenContainer.html('<p style="text-align:center; padding-top:50px; font-style:italic;">Aucun tableau à afficher en plein écran.</p>');
    }
  }
}

/**
 * Applique ou retire la classe fixed-width aux conteneurs de tableau
 */
function applyFixedWidthMode() {
  const $pivotUIContainer = $('#table');
  const $fullscreenContainer = $('#fullscreen-table-container');

  if (fixedWidthMode) {
    $pivotUIContainer.addClass('fixed-width');
    $fullscreenContainer.addClass('fixed-width');
  } else {
    $pivotUIContainer.removeClass('fixed-width');
    $fullscreenContainer.removeClass('fixed-width');
  }
}

function applyViewMode() {
  const $pivotUIContainer = $('#table');
  const $fullscreenContainer = $('#fullscreen-table-container');
  const $body = $('body');
  // Le sélecteur de vue original et le bouton de sortie sont gérés par CSS via la classe .fullscreen-active

  if (currentViewMode === 'fullscreen') {
    updateFullscreenTable();
    $pivotUIContainer.hide();
    $fullscreenContainer.show();
    $body.addClass('fullscreen-active');
    $(window).trigger('resize');
  } else { // 'pivot' mode
    $fullscreenContainer.hide().empty();
    $pivotUIContainer.show();
    $body.removeClass('fullscreen-active');
    $(window).trigger('resize');
  }
}

function wavg (n) {
  if (!n) { return; }
  n = n.filter(([note]) => typeof (note) === 'number');
  if (n.length) { return n.map(([note, coef]) => note * coef).reduce((a, b) => a + b) / n.map(([_note, coef]) => coef).reduce((a, b) => a + b); }
}

function weightedAverage ([val, coef]) {
  return (_data, _rowKey, _colKey) => ({
    values: [],
    push: function (rec) { this.values.push([rec[val], rec[coef]]); },
    value: function () { return wavg(this.values); },
    format: function (x) { return (Math.round(x * 100) / 100).toFixed(2); },
    numInputs: 2
  });
}

// Traduction du nom des opérations mathématiques en français
$.extend(
  $.pivotUtilities.aggregators,
  $.pivotUtilities.locales.fr.aggregators,
  { 'Moyenne pondérée': weightedAverage }
);

// Traduction du nom des types de visualisation en français
$.extend($.pivotUtilities.locales.fr.renderers,
         $.pivotUtilities.export_renderers);

// Fonction qui attend que le tableau croisé dynamique soit complètement chargé, et applique le mode plein écran si nécessaire
function checkPivotTableAndApplyFullscreen() {
  const $pivotTable = $('#table').find('table.pvtTable');

  if ($pivotTable.length > 0) {
    // Le tableau est prêt, mettons à jour le mode plein écran si nécessaire
    if (currentViewMode === 'fullscreen') {
      updateFullscreenTable();
    }

    // Ajouter les sous-totaux si activés
    if (subtotalsEnabledState && SubtotalsManager) {
      SubtotalsManager.addSubtotalsToTable(currentPivotConfig);
      if (currentViewMode === 'fullscreen') {
        SubtotalsManager.addSubtotalsToFullscreenTable(currentPivotConfig);
      }
    }

    // Appliquer le styling des agrégations multiples
    if (multiAggregationEnabled && MultiAggregationManager) {
      const $pivotTable = $('#table').find('table.pvtTable');
      MultiAggregationManager.applyAggregationStyling($pivotTable[0]);
    }

    pivotTableInitialized = true;
    return true;
  }

  // Si le tableau n'est pas encore prêt, attendre un peu et réessayer
  return false;
}

/**
 * RESPONSIVE DESIGN UTILITIES
 * ============================================================================
 */

/**
 * Détecte la taille de l'écran et retourne le mode responsive
 * @returns {string} 'mobile-small' | 'mobile' | 'tablet' | 'desktop'
 */
function getScreenSize() {
  const width = window.innerWidth;
  if (width < 480) return 'mobile-small';
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Détecte si l'écran est en mode portrait ou landscape
 */
function getScreenOrientation() {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * Applique automatiquement la taille de colonne idéale selon la taille de l'écran
 */
function applyResponsiveColumnSize() {
  const screenSize = getScreenSize();
  const savedSize = localStorage.getItem('columnSizePreference');

  // Ne pas forcer la taille si elle a été explicitement définie par l'utilisateur
  if (savedSize && savedSize !== '1.0') {
    return;
  }

  let autoSize = '1.0';
  switch (screenSize) {
    case 'mobile-small':
      autoSize = '0.4'; // Très compact pour petits mobiles
      break;
    case 'mobile':
      autoSize = '0.5'; // Compact pour mobiles
      break;
    case 'tablet':
      autoSize = '0.7'; // Moyennement compact pour tablettes
      break;
    default:
      autoSize = '1.0'; // Normal pour desktop
  }

  // Appliquer la taille seulement si c'est différent de la taille normale
  if (autoSize !== '1.0') {
    changeColumnSize(autoSize);
    $('#column-size-select').val(autoSize);
  }
}

/**
 * Optimise la visibilité du tableau pour les petits écrans avec sticky headers
 */
function optimizeTableForMobile() {
  const screenSize = getScreenSize();
  const $table = $('#table').find('table.pvtTable');
  const $fullscreenTable = $('#fullscreen-table-container').find('table.pvtTable');

  if (screenSize === 'mobile-small' || screenSize === 'mobile') {
    // Appliquer les optimisations au tableau principal
    if ($table.length > 0) {
      // Rendre les headers "sticky" pour scroll horizontal
      $table.find('thead tr th').each(function() {
        $(this).css({
          'position': 'sticky',
          'top': '0',
          'z-index': '10',
          'background-color': 'var(--table-header-bg)',
          'border-bottom': '2px solid var(--table-border)'
        });
      });

      // Les en-têtes des lignes (th dans tbody) restent collés à gauche
      $table.find('tbody tr th').each(function() {
        $(this).css({
          'position': 'sticky',
          'left': '0',
          'z-index': '11',
          'background-color': 'var(--table-header-bg)'
        });
      });
    }

    // Appliquer les mêmes optimisations au tableau en mode plein écran
    if ($fullscreenTable.length > 0) {
      $fullscreenTable.find('thead tr th').each(function() {
        $(this).css({
          'position': 'sticky',
          'top': '0',
          'z-index': '10'
        });
      });

      $fullscreenTable.find('tbody tr th').each(function() {
        $(this).css({
          'position': 'sticky',
          'left': '0',
          'z-index': '11'
        });
      });
    }
  }
}

/**
 * Gère le redimensionnement de la fenêtre
 */
function handleWindowResize() {
  optimizeTableForMobile();
  applyResponsiveColumnSize();

  // Rafraîchir le tableau pour qu'il s'adapte à la nouvelle taille
  $(window).trigger('resize');
}

/**
 * Initialise les gestionnaires de responsive design
 */
function initResponsiveDesign() {
  // Détecter les changements d'orientation
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      applyResponsiveColumnSize();
      handleWindowResize();
    }, 100);
  });

  // Détecter les changements de taille de fenêtre avec délai de debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      handleWindowResize();
    }, 250); // Délai pour éviter les multiples déclenchements
  });

  // Appliquer les optimisations initiales
  applyResponsiveColumnSize();
  optimizeTableForMobile();
}

/**
 * Restaure la taille des colonnes après un changement de vue
 * Applique la taille sauvegardée en localStorage et met à jour le sélecteur
 */
function restoreColumnSizeAfterViewChange() {
  const savedColumnSize = localStorage.getItem('columnSizePreference') || '1.0';

  // Mettre à jour le sélecteur
  const selector = document.getElementById('column-size-select');
  if (selector) {
    selector.value = savedColumnSize;
  }

  // Appliquer la taille
  changeColumnSize(savedColumnSize);

  // Si on est en mode plein écran, mettre à jour le tableau cloné
  if (currentViewMode === 'fullscreen') {
    setTimeout(() => {
      updateFullscreenTable();
    }, 100);
  }

  // Réappliquer les couleurs
  setTimeout(() => {
    applyVariableColors();
  }, 150);
}

/**
 * Gère le changement d'agrégations multiples
 */
function handleMultiAggregationChange(event) {
  if (!MultiAggregationManager) return;

  const selectedAggs = MultiAggregationManager.getSelectedAggregations();
  multiAggregationEnabled = selectedAggs.length > 1;

  // Sauvegarder la configuration
  grist.setOption('multiAggregations', {
    selected: selectedAggs,
    enabled: multiAggregationEnabled
  }).catch(err => {
    console.error("Failed to save multiAggregations:", err);
  });
}

// Rendu allégé de la pivot table sans les autres possibilités de visualisation + traduction de Moyenne pondérée
grist.onRecords(async rec => {
  lastPivotData = rec;  // Sauvegarde globale des données reçues
  pivotTableInitialized = false; // Réinitialiser l'état d'initialisation

  // Récupération des options de configuration précédemment sauvegardées
  let settings = await grist.getOption('settings') ?? {};
  let { rows, cols, vals, aggregatorName, rendererName } = settings;

  // Stockage des champs Valeur originaux
  originalVals = Array.isArray(vals) ? [...vals] : [];

  // Récupération de la taille des colonnes sauvegardée
  try {
    // Essayer d'abord localStorage (préférence locale persistante)
    const localStorageSize = localStorage.getItem('columnSizePreference');
    if (localStorageSize) {
      $('#column-size-select').val(localStorageSize);
      changeColumnSize(localStorageSize);
    } else {
      // Sinon, essayer les options Grist
      const savedColumnSize = await grist.getOption('columnSize');
      if (savedColumnSize) {
        $('#column-size-select').val(savedColumnSize);
        changeColumnSize(savedColumnSize);
      } else {
        changeColumnSize('1.0');
      }
    }
  } catch (e) {
    console.error("Error loading columnSize:", e);
    changeColumnSize('1.0');
  }

  // Stockage centralisé de la config pour facilité de mise à jour
  currentPivotConfig = { rows, cols, vals, aggregatorName, rendererName };

  // l'ancien label était en anglais, on le mappe en français
  const mapEnToFr = { 'Weighted Average': 'Moyenne pondérée' };
  if (aggregatorName in mapEnToFr) {
    aggregatorName = mapEnToFr[aggregatorName];
    currentPivotConfig.aggregatorName = aggregatorName;  // Mise à jour dans config centrale
  }

  let firstRefresh = true; // Pour éviter d'écrire dans grist à la première initialisation

  $('#table').pivotUI(
    rec,
    {
      rows: currentPivotConfig.rows,
      cols: currentPivotConfig.cols,
      vals: currentPivotConfig.vals,

      // Lors d'une modification par l'utilisateur
      onRefresh(config) {
        if (firstRefresh) {
          firstRefresh = false;

          // Appliquer les couleurs lors de la première initialisation
          setTimeout(() => {
            applyVariableColors();
          }, 150);

          // Ajouter les sous-totaux si activés
          if (subtotalsEnabledState && SubtotalsManager) {
            SubtotalsManager.addSubtotalsToTable(config);
          }

          // Appliquer le styling des agrégations multiples
          if (multiAggregationEnabled && MultiAggregationManager) {
            const $pivotTable = $('#table').find('table.pvtTable');
            MultiAggregationManager.applyAggregationStyling($pivotTable[0]);
          }

          return;
        }
        currentPivotConfig = {
          rows: config.rows,
          cols: config.cols,
          vals: config.vals,
          aggregatorName: config.aggregatorName,
          rendererName: config.rendererName,
        };

        // Sauvegarde des options modifiées dans Grist
        grist.setOption('settings', currentPivotConfig);

        // Si on est en mode fullscreen, mettre à jour le tableau cloné
        if (currentViewMode === 'fullscreen') {
          updateFullscreenTable();
        }
        // Réappliquer les couleurs après modification
        applyVariableColors();

        // Ajouter les sous-totaux si activés
        if (subtotalsEnabledState && SubtotalsManager) {
          SubtotalsManager.addSubtotalsToTable(currentPivotConfig);
          if (currentViewMode === 'fullscreen') {
            SubtotalsManager.addSubtotalsToFullscreenTable(currentPivotConfig);
          }
        }

        // Appliquer le styling des agrégations multiples
        if (multiAggregationEnabled && MultiAggregationManager) {
          const $pivotTable = $('#table').find('table.pvtTable');
          MultiAggregationManager.applyAggregationStyling($pivotTable[0]);
        }
      },

      aggregatorName: currentPivotConfig.aggregatorName,
      rendererName: currentPivotConfig.rendererName,
    },
    false,  // overwrite = false, on ne remplace pas tout, on conserve ce qui existe
    'fr'    // locale française pour les labels par défaut
  );

  // Créer de manière dynamique les Labels "colonnes" "lignes" "Valeurs"
  PivotLabels.init();

  // Charger l'état des sous-totaux
  try {
    const savedSubtotalsState = await grist.getOption('subtotalsEnabled');
    if (savedSubtotalsState !== undefined) {
      subtotalsEnabledState = savedSubtotalsState;
      $('#subtotals-checkbox').prop('checked', subtotalsEnabledState);
      if (SubtotalsManager) {
        SubtotalsManager.setSubtotalsEnabled(subtotalsEnabledState);
      }
    }
  } catch (e) {
    console.error("Error loading subtotalsEnabled from Grist options:", e);
  }

  // Charger l'état du mode fixe
  try {
    const localStorageFixedWidth = localStorage.getItem('fixedWidthMode');
    if (localStorageFixedWidth !== null) {
      fixedWidthMode = localStorageFixedWidth === 'true';
    } else {
      const savedFixedWidthMode = await grist.getOption('fixedWidthMode');
      if (savedFixedWidthMode !== undefined) {
        fixedWidthMode = savedFixedWidthMode;
      }
    }
    $('#fixed-width-checkbox').prop('checked', fixedWidthMode);
    applyFixedWidthMode();
  } catch (e) {
    console.error("Error loading fixedWidthMode:", e);
  }

  // Initialiser le gestionnaire des agrégations multiples
  if (MultiAggregationManager) {
    MultiAggregationManager.init();
    MultiAggregationManager.addAggregationControls();

    // Charger l'état des agrégations multiples sauvegardé
    await MultiAggregationManager.loadAggregationState();
    const selectedAggs = MultiAggregationManager.getSelectedAggregations();
    multiAggregationEnabled = selectedAggs.length > 1;
  }

  // Initialiser l'interceptor pour l'export XLSX personnalisé
  setupExcelExportInterceptor();

  // Appliquer les couleurs après l'initialisation complète
  setTimeout(() => {
    applyVariableColors();
  }, 200);

  try {
    const savedViewMode = await grist.getOption('viewMode');
    if (savedViewMode && (savedViewMode === 'pivot' || savedViewMode === 'fullscreen')) {
      currentViewMode = savedViewMode;
      $('#view-mode-select').val(currentViewMode);
    }
  } catch (e) {
    console.error("Error loading viewMode from Grist options:", e);
  }
  applyViewMode();

  // Vérifier périodiquement si le tableau est chargé pour le mode plein écran
  if (currentViewMode === 'fullscreen') {
    const checkInterval = setInterval(() => {
      if (checkPivotTableAndApplyFullscreen()) {
        clearInterval(checkInterval);
      }
    }, 200);

    // Arrêter de vérifier après 5 secondes dans tous les cas
    setTimeout(() => clearInterval(checkInterval), 5000);
  }

  // Initialiser le responsive design après le chargement du tableau
  setTimeout(() => {
    initResponsiveDesign();
    optimizeTableForMobile();
  }, 300);

  // Ajouter l'écouteur pour les changements d'agrégations multiples
  document.removeEventListener('multiAggregationChanged', handleMultiAggregationChange);
  document.addEventListener('multiAggregationChanged', handleMultiAggregationChange);
});

$(document).ready(function() {
  // Initialiser les gestionnaires de responsive design
  initResponsiveDesign();

  // Gestionnaire pour le sélecteur de vue original
  $('#view-mode-select').on('change', function() {
    currentViewMode = $(this).val();
    grist.setOption('viewMode', currentViewMode).catch(err => {
        console.error("Failed to save viewMode:", err);
    });
    applyViewMode();

    // Restaurer la taille des colonnes après le changement de vue
    restoreColumnSizeAfterViewChange();
  });

  // Gestionnaire pour le bouton "Quitter plein écran"
  $('#fullscreen-exit-button').on('click', function() {
    currentViewMode = 'pivot';
    $('#view-mode-select').val('pivot');
    grist.setOption('viewMode', currentViewMode).catch(err => {
        console.error("Failed to save viewMode:", err);
    });
    applyViewMode();

    // Restaurer la taille des colonnes à la sortie du plein écran
    restoreColumnSizeAfterViewChange();
  });

  // Gestionnaire pour la taille des colonnes
  $('#column-size-select').on('change', function() {
    const selectedSize = $(this).val();

    // Sauvegarder dans localStorage (préférence locale persistante)
    try {
      localStorage.setItem('columnSizePreference', selectedSize);
    } catch (e) {
      console.warn("Failed to save columnSize to localStorage:", e);
    }

    // Sauvegarder également dans Grist
    grist.setOption('columnSize', selectedSize).catch(err => {
      console.error("Failed to save columnSize to Grist:", err);
    });

    // Appliquer la nouvelle taille
    changeColumnSize(selectedSize);

    // Si on est en mode plein écran, mettre à jour le contenu
    if (currentViewMode === 'fullscreen') {
      setTimeout(() => {
        updateFullscreenTable();
      }, 100);
    }

    // Réappliquer les couleurs après changement de taille
    setTimeout(() => {
      applyVariableColors();
    }, 150);
  });

  // Gestionnaire pour la case à cocher des sous-totaux
  $('#subtotals-checkbox').on('change', function() {
    subtotalsEnabledState = $(this).is(':checked');

    // Sauvegarder dans Grist
    grist.setOption('subtotalsEnabled', subtotalsEnabledState).catch(err => {
      console.error("Failed to save subtotalsEnabled:", err);
    });

    // Activer/désactiver les sous-totaux
    if (SubtotalsManager) {
      SubtotalsManager.setSubtotalsEnabled(subtotalsEnabledState);
      if (subtotalsEnabledState) {
        SubtotalsManager.addSubtotalsToTable(currentPivotConfig);
        if (currentViewMode === 'fullscreen') {
          SubtotalsManager.addSubtotalsToFullscreenTable(currentPivotConfig);
        }
      }
    }
  });

  // Gestionnaire pour la case à cocher du mode fixe
  $('#fixed-width-checkbox').on('change', function() {
    fixedWidthMode = $(this).is(':checked');

    // Sauvegarder dans localStorage (préférence locale persistante)
    try {
      localStorage.setItem('fixedWidthMode', fixedWidthMode);
    } catch (e) {
      console.warn("Failed to save fixedWidthMode to localStorage:", e);
    }

    // Sauvegarder également dans Grist
    grist.setOption('fixedWidthMode', fixedWidthMode).catch(err => {
      console.error("Failed to save fixedWidthMode to Grist:", err);
    });

    // Appliquer le mode fixe immédiatement
    applyFixedWidthMode();

    // Si on est en mode plein écran, mettre à jour le tableau
    if (currentViewMode === 'fullscreen') {
      setTimeout(() => {
        updateFullscreenTable();
      }, 100);
    }
  });

  // Observer pour réappliquer les couleurs automatiquement
  // Observer les mutations DOM pour réappliquer les couleurs quand nécessaire
  const observer = new MutationObserver(function(mutations) {
    let shouldReapplyColors = false;

    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Vérifier si des éléments .pvtAttr ont été ajoutés
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if ($(node).find('.pvtAttr').length > 0 || $(node).hasClass('pvtAttr')) {
              shouldReapplyColors = true;
            }
          }
        });
      }
    });

    if (shouldReapplyColors) {
      applyVariableColors();
    }
  });

  // Observer les changements dans les containers de pivot
  const targetNode = document.getElementById('table');
  if (targetNode) {
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  }

  const fullscreenNode = document.getElementById('fullscreen-table-container');
  if (fullscreenNode) {
    observer.observe(fullscreenNode, {
      childList: true,
      subtree: true
    });
  }
});
