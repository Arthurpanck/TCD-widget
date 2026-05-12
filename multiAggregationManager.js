/**
 * Gestionnaire des agrégations multiples pour le tableau croisé dynamique
 * Permet d'afficher plusieurs colonnes d'agrégation avec différentes fonctions
 * (Somme, Moyenne, Comptage, Min, Max, etc.)
 */

const MultiAggregationManager = (function() {
  // Configuration des agrégations disponibles
  const AGGREGATION_CONFIG = {
    sum: {
      label: 'Somme',
      aggregator: 'Sum',
      color: '#10b981'
    },
    average: {
      label: 'Moyenne',
      aggregator: 'Average',
      color: '#3b82f6'
    },
    count: {
      label: 'Comptage',
      aggregator: 'Count',
      color: '#f59e0b'
    },
    min: {
      label: 'Minimum',
      aggregator: 'Min',
      color: '#ef4444'
    },
    max: {
      label: 'Maximum',
      aggregator: 'Max',
      color: '#8b5cf6'
    },
    median: {
      label: 'Médiane',
      aggregator: 'Median',
      color: '#06b6d4'
    }
  };

  // État interne
  let selectedAggregations = ['sum']; // Agrégations sélectionnées par défaut
  let multiAggregationEnabled = false;
  let currentConfig = {};

  /**
   * Initialise le gestionnaire des agrégations multiples
   */
  function init() {
    // Charger l'état sauvegardé des agrégations
    loadAggregationState();

    // Initialiser les gestionnaires d'événements
    setupEventHandlers();
  }

  /**
   * Charge l'état sauvegardé des agrégations multiples
   */
  async function loadAggregationState() {
    try {
      const savedState = await grist.getOption('multiAggregations');
      if (savedState && typeof savedState === 'object') {
        selectedAggregations = savedState.selected || ['sum'];
        multiAggregationEnabled = savedState.enabled || false;
        updateUIState();
      }
    } catch (e) {
      console.error("Error loading multi-aggregation state:", e);
    }
  }

  /**
   * Configure les gestionnaires d'événements pour les checkboxes
   */
  function setupEventHandlers() {
    document.addEventListener('change', function(e) {
      // Gérer les checkboxes d'agrégation
      if (e.target.classList.contains('agg-checkbox')) {
        handleAggregationCheckboxChange(e.target);
      }
    });
  }

  /**
   * Gère le changement d'une checkbox d'agrégation
   */
  function handleAggregationCheckboxChange(checkbox) {
    const aggKey = checkbox.dataset.aggKey;
    const isChecked = checkbox.checked;

    if (isChecked) {
      if (!selectedAggregations.includes(aggKey)) {
        selectedAggregations.push(aggKey);
      }
    } else {
      // Ne pas permettre de désélectionner tout
      if (selectedAggregations.length > 1) {
        selectedAggregations = selectedAggregations.filter(a => a !== aggKey);
      } else {
        // Recochée si c'était la dernière
        checkbox.checked = true;
      }
    }

    // Sauvegarder l'état
    saveAggregationState();

    // Notifier que la configuration a changé
    triggerAggregationChange();
  }

  /**
   * Sauvegarde l'état des agrégations
   */
  async function saveAggregationState() {
    try {
      await grist.setOption('multiAggregations', {
        selected: selectedAggregations,
        enabled: multiAggregationEnabled
      });
    } catch (e) {
      console.error("Error saving multi-aggregation state:", e);
    }
  }

  /**
   * Déclenche le changement d'agrégation
   */
  function triggerAggregationChange() {
    const event = new CustomEvent('multiAggregationChanged', {
      detail: { aggregations: selectedAggregations }
    });
    document.dispatchEvent(event);
  }

  /**
   * Configure le pivot table pour les agrégations multiples
   */
  function configurePivotForMultiAggregation(config) {
    currentConfig = config;

    if (selectedAggregations.length <= 1) {
      // Mode simple : une seule agrégation
      return config;
    }

    // Mode multiple : créer des colonnes virtuelles pour chaque agrégation
    const enhancedConfig = { ...config };

    // Si vals contient des champs
    if (config.vals && config.vals.length > 0) {
      // Pour chaque agrégation sélectionnée, ajouter une entrée dans vals
      const newVals = [];

      selectedAggregations.forEach(aggKey => {
        config.vals.forEach(fieldName => {
          // Créer un identifiant unique pour chaque combinaison
          const virtualFieldName = `${fieldName}_${aggKey}`;
          newVals.push(virtualFieldName);
        });
      });

      enhancedConfig.vals = newVals;

      // Mettre à jour le nom de l'agrégateur pour le pivot
      // On va utiliser des agrégateurs personnalisés
      enhancedConfig.aggregatorName = 'Sum'; // Valeur par défaut
    }

    return enhancedConfig;
  }

  /**
   * Crée des agrégateurs dérivés pour les champs virtuels
   */
  function createDerivedAggregators(data, originalFields) {
    const derivedAggs = {};

    selectedAggregations.forEach(aggKey => {
      const aggConfig = AGGREGATION_CONFIG[aggKey];
      if (!aggConfig) return;

      originalFields.forEach(fieldName => {
        const virtualFieldName = `${fieldName}_${aggKey}`;

        // Créer un champ dérivé pour chaque combinaison
        data.forEach(record => {
          if (!record[virtualFieldName]) {
            record[virtualFieldName] = record[fieldName];
          }
        });

        // Créer un agrégateur pour ce champ
        derivedAggs[virtualFieldName] = aggConfig.aggregator;
      });
    });

    return derivedAggs;
  }

  /**
   * Met à jour l'interface utilisateur avec l'état actuel
   */
  function updateUIState() {
    document.querySelectorAll('.agg-checkbox').forEach(checkbox => {
      const aggKey = checkbox.dataset.aggKey;
      checkbox.checked = selectedAggregations.includes(aggKey);
    });
  }

  /**
   * Retourne les agrégations sélectionnées
   */
  function getSelectedAggregations() {
    return [...selectedAggregations];
  }

  /**
   * Définit les agrégations sélectionnées
   */
  function setSelectedAggregations(aggregations) {
    if (Array.isArray(aggregations) && aggregations.length > 0) {
      selectedAggregations = aggregations;
      updateUIState();
      saveAggregationState();
      triggerAggregationChange();
    }
  }

  /**
   * Active/désactive le mode agrégations multiples
   */
  function setMultiAggregationEnabled(enabled) {
    multiAggregationEnabled = enabled;
    saveAggregationState();
  }

  /**
   * Retourne true si le mode agrégations multiples est activé
   */
  function isMultiAggregationEnabled() {
    return multiAggregationEnabled && selectedAggregations.length > 1;
  }

  /**
   * Retourne la configuration des agrégations
   */
  function getAggregationConfig() {
    return { ...AGGREGATION_CONFIG };
  }

  /**
   * Retourne la couleur d'une agrégation
   */
  function getAggregationColor(aggKey) {
    const config = AGGREGATION_CONFIG[aggKey];
    return config ? config.color : '#64748b';
  }

  /**
   * Retourne le label d'une agrégation
   */
  function getAggregationLabel(aggKey) {
    const config = AGGREGATION_CONFIG[aggKey];
    return config ? config.label : aggKey;
  }

  /**
   * Crée un élément HTML pour afficher les contrôles des agrégations
   */
  function createAggregationControls() {
    const container = document.createElement('div');
    container.id = 'multi-agg-controls';
    container.className = 'multi-agg-controls';

    // Titre
    const title = document.createElement('div');
    title.className = 'multi-agg-title';
    title.textContent = 'Agrégations';
    container.appendChild(title);

    // Checkboxes
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'multi-agg-checkboxes';

    Object.keys(AGGREGATION_CONFIG).forEach(key => {
      const config = AGGREGATION_CONFIG[key];

      const label = document.createElement('label');
      label.className = 'agg-checkbox-label';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'agg-checkbox';
      checkbox.dataset.aggKey = key;
      checkbox.checked = selectedAggregations.includes(key);

      const labelText = document.createElement('span');
      labelText.textContent = config.label;
      labelText.style.color = config.color;
      labelText.style.fontWeight = '500';

      label.appendChild(checkbox);
      label.appendChild(labelText);
      checkboxContainer.appendChild(label);
    });

    container.appendChild(checkboxContainer);
    return container;
  }

  /**
   * Ajoute les contrôles des agrégations à la page
   */
  function addAggregationControls() {
    const controlsContainer = document.getElementById('controls-container');
    if (!controlsContainer) return;

    // Supprimer les contrôles existants s'ils existent
    const existing = document.getElementById('multi-agg-controls');
    if (existing) existing.remove();

    // Créer et ajouter les nouveaux contrôles
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';

    const aggControls = createAggregationControls();
    controlGroup.appendChild(aggControls);
    controlsContainer.appendChild(controlGroup);
  }

  /**
   * Applique le style des agrégations aux colonnes du tableau
   */
  function applyAggregationStyling(pivotTable) {
    if (!pivotTable || selectedAggregations.length <= 1) return;

    // Parcourir les en-têtes de colonnes et appliquer les couleurs
    $(pivotTable).find('tbody tr').each(function() {
      $(this).find('td').each(function() {
        const text = $(this).text();

        // Vérifier si le texte contient un label d'agrégation
        selectedAggregations.forEach(aggKey => {
          const label = getAggregationLabel(aggKey);
          if (text.includes(label)) {
            const color = getAggregationColor(aggKey);
            $(this).css({
              'border-left': `3px solid ${color}`,
              'background-color': `${color}15` // Ajout de transparence
            });
          }
        });
      });
    });
  }

  /**
   * Nettoie les ressources
   */
  function destroy() {
    const controls = document.getElementById('multi-agg-controls');
    if (controls) controls.remove();
  }

  // API publique
  return {
    init: init,
    loadAggregationState: loadAggregationState,
    configurePivotForMultiAggregation: configurePivotForMultiAggregation,
    createDerivedAggregators: createDerivedAggregators,
    getSelectedAggregations: getSelectedAggregations,
    setSelectedAggregations: setSelectedAggregations,
    setMultiAggregationEnabled: setMultiAggregationEnabled,
    isMultiAggregationEnabled: isMultiAggregationEnabled,
    getAggregationConfig: getAggregationConfig,
    getAggregationColor: getAggregationColor,
    getAggregationLabel: getAggregationLabel,
    createAggregationControls: createAggregationControls,
    addAggregationControls: addAggregationControls,
    applyAggregationStyling: applyAggregationStyling,
    destroy: destroy
  };
})();
