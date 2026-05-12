/**
 * excelExporter.js
 * Handles extraction of pivot table data and generation of Excel files
 */

/**
 * Extracts data from the pivot table DOM
 * Reads headers and rows from the visible pivot table
 * @returns {Object} { headers: [], rows: [] }
 */
function extractPivotTableData() {
  const $table = $('#table').find('table.pvtTable');

  if ($table.length === 0) {
    console.warn('No pivot table found');
    return { headers: [], rows: [] };
  }

  const headers = [];
  const rows = [];

  // Extract headers from all thead th elements
  $table.find('thead th').each(function() {
    headers.push($(this).text().trim());
  });

  // Extract rows from tbody
  $table.find('tbody tr').each(function() {
    const row = [];
    $(this).find('td').each(function() {
      // Get text content and clean it
      let cellText = $(this).text().trim();

      // Try to parse as number for proper Excel formatting
      const numValue = parseFloat(cellText);
      row.push(isNaN(numValue) ? cellText : numValue);
    });
    if (row.length > 0) {
      rows.push(row);
    }
  });

  return { headers, rows };
}

/**
 * Generates an Excel workbook from pivot table data
 * Uses the XLSX library to create a properly formatted Excel file
 * @param {Object} data - { headers: [], rows: [] }
 * @returns {Object} XLSX workbook object
 */
function generateExcelWorkbook(data) {
  const { headers, rows } = data;

  // Prepare worksheet data: headers + rows
  const wsData = [headers, ...rows];

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Create worksheet from data
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths for better readability
  const colWidths = headers.map(header => {
    // Minimum width of 12, or length of header + 2 for padding
    return Math.max(12, header.length + 2);
  });
  ws['!cols'] = colWidths.map(w => ({ wch: w }));

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Pivot Table');

  return wb;
}

/**
 * Downloads an Excel file with the pivot table data
 * Generates filename with current timestamp
 */
function downloadPivotTableAsExcel() {
  try {
    // Check if XLSX library is available
    if (typeof XLSX === 'undefined') {
      alert('XLSX library not loaded. Please refresh the page.');
      console.error('XLSX library is not available');
      return;
    }

    // Extract data from the pivot table
    const data = extractPivotTableData();

    if (data.headers.length === 0) {
      alert('No pivot table data to export');
      return;
    }

    // Generate the workbook
    const workbook = generateExcelWorkbook(data);

    // Create filename with timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `pivot_table_${timestamp}.xlsx`;

    // Write and download the file
    XLSX.writeFile(workbook, filename);

    console.log(`Excel file exported: ${filename}`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Error exporting to Excel: ' + error.message);
  }
}

/**
 * Intercepts the export renderer button clicks to provide custom XLSX export
 * This function should be called after the pivot table is initialized
 */
function setupExcelExportInterceptor() {
  // Use a MutationObserver to detect when export buttons are added to the DOM
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any export-related buttons were added
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            const $node = $(node);

            // Look for export buttons in the newly added content
            $node.find('.pvtButton, button[data-export], select[class*="export"]').each(function() {
              setupExcelButtonHandler($(this));
            });

            // Also check if the node itself is an export button
            if ($node.hasClass('pvtButton') || $node.attr('data-export') || $node.find('option:contains("Excel")').length > 0) {
              setupExcelButtonHandler($node);
            }
          }
        });
      }
    });
  });

  // Observe the pivot table container for changes
  const targetNode = document.getElementById('table');
  if (targetNode) {
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  }
}

/**
 * Sets up click handler for export buttons to intercept XLSX export
 * @param {jQuery} $element - The button or select element
 */
function setupExcelButtonHandler($element) {
  if ($element.is('select')) {
    // For select dropdowns, monitor changes
    $element.on('change.xlsxExport', function() {
      const selectedText = $(this).find('option:selected').text();

      // If "Classeur Excel" or similar is selected, trigger our custom export
      if (selectedText.toLowerCase().includes('excel') || selectedText.toLowerCase().includes('xlsx')) {
        // Prevent the default export and use ours instead
        setTimeout(() => {
          downloadPivotTableAsExcel();
        }, 100);
      }
    });
  } else if ($element.is('button')) {
    // For buttons
    const buttonText = $element.text().toLowerCase();
    if (buttonText.includes('excel') || buttonText.includes('xlsx')) {
      $element.off('.xlsxExport').on('click.xlsxExport', function(e) {
        e.preventDefault();
        e.stopPropagation();
        downloadPivotTableAsExcel();
        return false;
      });
    }
  }
}
