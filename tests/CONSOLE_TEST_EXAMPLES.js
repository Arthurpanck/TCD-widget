/**
 * Exemples de tests en console pour valider la persistance du columnSize
 * À copier-coller directement dans la console du navigateur (F12)
 */

// ============================================================================
// SECTION 1: Vérifier l'état du localStorage
// ============================================================================

// Test 1.1: Voir la valeur actuellement sauvegardée
console.log("📦 localStorage.getItem('columnSizePreference'):",
    localStorage.getItem('columnSizePreference'));

// Test 1.2: Voir la valeur du sélecteur HTML
console.log("📋 Valeur du sélecteur:",
    $('#column-size-select').val());

// Test 1.3: Voir le mode d'affichage actuel
console.log("🎨 Mode d'affichage actuel:",
    currentViewMode);

// Test 1.4: Voir tout le localStorage
console.log("📊 Contenu complet de localStorage:");
console.table(JSON.parse(JSON.stringify(localStorage)));

// ============================================================================
// SECTION 2: Tester la sauvegarde
// ============================================================================

// Test 2.1: Sauvegarder une taille manuellement et vérifier
function test_manual_save() {
    const testSize = '0.75';
    localStorage.setItem('columnSizePreference', testSize);
    console.log("✅ Sauvegardé:", testSize);
    console.log("✓ Vérification:", localStorage.getItem('columnSizePreference'));
}
// Exécuter: test_manual_save()

// Test 2.2: Sauvegarder plusieurs valeurs et vérifier chacune
function test_multiple_saves() {
    const sizes = ['0.5', '0.7', '0.9', '1.0'];
    sizes.forEach(size => {
        localStorage.setItem('columnSizePreference', size);
        const saved = localStorage.getItem('columnSizePreference');
        console.log(`Sauvegardé: ${size}, Récupéré: ${saved}, Match: ${size === saved}`);
    });
}
// Exécuter: test_multiple_saves()

// ============================================================================
// SECTION 3: Tester la restauration
// ============================================================================

// Test 3.1: Restaurer manuellement une taille sauvegardée
function test_restore() {
    const savedSize = localStorage.getItem('columnSizePreference') || '1.0';
    console.log("Restauration de la taille:", savedSize);

    // Mettre à jour le sélecteur
    $('#column-size-select').val(savedSize);
    console.log("✓ Sélecteur mis à jour:", $('#column-size-select').val());

    // Appliquer la taille
    changeColumnSize(savedSize);
    console.log("✓ Taille appliquée");
}
// Exécuter: test_restore()

// Test 3.2: Exécuter la fonction de restauration officielle
function test_official_restore() {
    console.log("Avant restauration:");
    console.log("  Sélecteur:", $('#column-size-select').val());

    restoreColumnSizeAfterViewChange();

    console.log("Après restauration:");
    console.log("  Sélecteur:", $('#column-size-select').val());
    console.log("  Mode:", currentViewMode);
}
// Exécuter: test_official_restore()

// ============================================================================
// SECTION 4: Tester les changements de mode
// ============================================================================

// Test 4.1: Simuler un changement de taille
function test_size_change(newSize) {
    console.log(`Avant: localStorage=${localStorage.getItem('columnSizePreference')}, sélecteur=${$('#column-size-select').val()}`);

    $('#column-size-select').val(newSize);
    $('#column-size-select').trigger('change');

    console.log(`Après: localStorage=${localStorage.getItem('columnSizePreference')}, sélecteur=${$('#column-size-select').val()}`);
}
// Exécuter: test_size_change('0.8')

// Test 4.2: Simuler un changement de mode
function test_mode_change(newMode) {
    console.log(`Avant: mode=${currentViewMode}, localStorage=${localStorage.getItem('columnSizePreference')}`);

    currentViewMode = newMode;
    $('#view-mode-select').val(newMode);
    applyViewMode();
    restoreColumnSizeAfterViewChange();

    console.log(`Après: mode=${currentViewMode}, sélecteur=${$('#column-size-select').val()}`);
}
// Exécuter: test_mode_change('fullscreen') ou test_mode_change('pivot')

// ============================================================================
// SECTION 5: Tester le cycle complet
// ============================================================================

// Test 5.1: Cycle complet de test
async function test_full_cycle() {
    console.log("🔄 DÉBUT DU CYCLE COMPLET DE TEST");

    // Étape 1: Sauvegarder une taille
    const testSize = '0.6';
    console.log(`\n1️⃣ Sauvegarder la taille ${testSize}`);
    localStorage.setItem('columnSizePreference', testSize);
    console.log(`   ✓ localStorage=${localStorage.getItem('columnSizePreference')}`);

    // Étape 2: Passer en fullscreen
    console.log(`\n2️⃣ Passer en mode fullscreen`);
    currentViewMode = 'fullscreen';
    $('#view-mode-select').val('fullscreen');
    console.log(`   Mode: ${currentViewMode}`);
    console.log(`   localStorage: ${localStorage.getItem('columnSizePreference')}`);
    console.log(`   Sélecteur: ${$('#column-size-select').val()}`);

    // Étape 3: Restaurer
    console.log(`\n3️⃣ Restaurer la taille`);
    restoreColumnSizeAfterViewChange();
    console.log(`   ✓ Sélecteur: ${$('#column-size-select').val()}`);
    console.log(`   ✓ localStorage: ${localStorage.getItem('columnSizePreference')}`);

    // Étape 4: Revenir en normal
    console.log(`\n4️⃣ Revenir en mode normal`);
    currentViewMode = 'pivot';
    $('#view-mode-select').val('pivot');
    restoreColumnSizeAfterViewChange();
    console.log(`   Mode: ${currentViewMode}`);
    console.log(`   ✓ Sélecteur: ${$('#column-size-select').val()}`);
    console.log(`   ✓ localStorage: ${localStorage.getItem('columnSizePreference')}`);

    // Étape 5: Vérification finale
    console.log(`\n5️⃣ VÉRIFICATION FINALE`);
    const finalSize = localStorage.getItem('columnSizePreference');
    const finalSelector = $('#column-size-select').val();
    const isMatch = finalSize === finalSelector;
    console.log(`   localStorage: ${finalSize}`);
    console.log(`   Sélecteur: ${finalSelector}`);
    console.log(`   ✓ MATCH: ${isMatch ? '✅ OUI' : '❌ NON'}`);

    if (isMatch && finalSize === testSize) {
        console.log(`\n✅ TEST RÉUSSI: La taille ${testSize} a été maintenue!`);
    } else {
        console.log(`\n❌ TEST ÉCHOUÉ: Incohérence détectée`);
    }
}
// Exécuter: test_full_cycle()

// ============================================================================
// SECTION 6: Tester les cas limites
// ============================================================================

// Test 6.1: localStorage vide
function test_empty_localstorage() {
    console.log("Avant suppression:");
    console.log("  localStorage:", localStorage.getItem('columnSizePreference'));

    localStorage.removeItem('columnSizePreference');

    console.log("Après suppression:");
    console.log("  localStorage:", localStorage.getItem('columnSizePreference'));
    console.log("  Valeur par défaut:", localStorage.getItem('columnSizePreference') || '1.0');
}
// Exécuter: test_empty_localstorage()

// Test 6.2: Tester avec différentes valeurs
function test_various_sizes() {
    const sizes = ['0.3', '0.5', '0.7', '0.9', '1.0', '1.2'];
    console.log("🧪 TEST DE DIFFÉRENTES TAILLES:\n");

    sizes.forEach(size => {
        localStorage.setItem('columnSizePreference', size);
        const selector = $('#column-size-select').val();

        console.log(`Taille: ${size}`);
        console.log(`  localStorage: ${localStorage.getItem('columnSizePreference')}`);
        console.log(`  Sélecteur avant changement: ${selector}`);
    });
}
// Exécuter: test_various_sizes()

// Test 6.3: Stress test (changements rapides)
async function test_stress() {
    console.log("⚡ STRESS TEST: Changements rapides");

    const sizes = ['0.4', '0.6', '0.8', '0.5', '0.9', '0.7'];

    for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        localStorage.setItem('columnSizePreference', size);
        changeColumnSize(size);

        await new Promise(resolve => setTimeout(resolve, 100));

        const saved = localStorage.getItem('columnSizePreference');
        console.log(`[${i + 1}/${sizes.length}] Taille ${size}, localStorage: ${saved}, Match: ${size === saved}`);
    }

    console.log("✅ Stress test terminé");
}
// Exécuter: test_stress()

// ============================================================================
// SECTION 7: Utilitaires de debug
// ============================================================================

// Utilitaire 7.1: Log complet de l'état
function log_full_state() {
    console.log("📊 ÉTAT COMPLET:");
    console.log({
        'currentViewMode': currentViewMode,
        'localStorage.columnSizePreference': localStorage.getItem('columnSizePreference'),
        'sélecteur.val': $('#column-size-select').val(),
        'sélecteur.text': $('#column-size-select').find('option:selected').text(),
        'bodyClass.fullscreen': $('body').hasClass('fullscreen-active'),
        'timestamp': new Date().toISOString()
    });
}
// Exécuter: log_full_state()

// Utilitaire 7.2: Nettoyer localStorage
function clear_localstorage() {
    localStorage.removeItem('columnSizePreference');
    console.log("✓ localStorage.columnSizePreference supprimé");
}
// Exécuter: clear_localstorage()

// Utilitaire 7.3: Définir une taille et log l'état
function set_and_log(size) {
    localStorage.setItem('columnSizePreference', size);
    changeColumnSize(size);
    $('#column-size-select').val(size);

    console.log(`Taille définie à ${size}:`);
    log_full_state();
}
// Exécuter: set_and_log('0.75')

// ============================================================================
// SECTION 8: Vérifications de régression
// ============================================================================

// Test 8.1: Vérifier que l'ancien comportement est fixé
function test_regression_fullscreen_size() {
    console.log("🐛 TEST DE RÉGRESSION: Le bug de réinitialisation est-il fixé?");

    // Avant le fix, cela aurait réinitialisé à 1.0
    const originalSize = '0.7';

    console.log(`1. Définir la taille à ${originalSize}`);
    localStorage.setItem('columnSizePreference', originalSize);
    $('#column-size-select').val(originalSize);
    changeColumnSize(originalSize);

    console.log(`2. Passer en fullscreen`);
    currentViewMode = 'fullscreen';
    applyViewMode();
    restoreColumnSizeAfterViewChange();

    const sizeAfterFullscreen = $('#column-size-select').val();
    console.log(`3. La taille après fullscreen: ${sizeAfterFullscreen}`);

    if (sizeAfterFullscreen === originalSize) {
        console.log(`✅ RÉGRESSION FIXÉE: La taille ${originalSize} a été conservée!`);
    } else {
        console.log(`❌ RÉGRESSION DÉTECTÉE: La taille est passée de ${originalSize} à ${sizeAfterFullscreen}`);
    }
}
// Exécuter: test_regression_fullscreen_size()

// ============================================================================
// RACCOURCIS PRATIQUES
// ============================================================================

// Afficher rapidement l'état
window.testState = () => log_full_state();

// Définir rapidement une taille
window.testSize = (size) => set_and_log(size);

// Exécuter le test complet
window.testAll = () => test_full_cycle();

// Afficher les raccourcis disponibles
function show_test_shortcuts() {
    console.log("🎯 RACCOURCIS DISPONIBLES:");
    console.log("  testState()           - Afficher l'état complet");
    console.log("  testSize(0.8)         - Définir une taille (ex: 0.8)");
    console.log("  testAll()             - Exécuter le test complet");
    console.log("  test_regression_fullscreen_size() - Vérifier le fix");
    console.log("  test_stress()         - Stress test");
    console.log("  clear_localstorage()  - Nettoyer localStorage");
}

console.log("✅ Scripts de test chargés!");
show_test_shortcuts();
