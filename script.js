document.addEventListener('DOMContentLoaded', () => {
    // --- Global State & Configuration ---
    const numberAnimationDuration = 800;
    const updateIntervalTime = 2500; // Interval for scenario switching
    const quartersPerYear = 4;
    const totalYears = 5;
    const totalQuarters = totalYears * quartersPerYear;
    const startYear = 2024;
    const actualSuffix = 'A';
    const estimatedSuffix = 'E';
    const yearHeaders = ["Metric", "2024A", "2025E", "2026E", "2027E", "2028E"]; // Define headers for lookups
    const projectedYears = ['2025E', '2026E', '2027E', '2028E'];
    const yearIndices = {};
    yearHeaders.forEach((year, index) => { yearIndices[year] = index; }); // Store 1-based index

    // --- DOM Elements --- //
    const allCounters = document.querySelectorAll('.financial-summary td[data-value]'); // All cells with data
    const arrChartContainer = document.querySelector('#arr-chart .arr-bars');
    const cashflowChartContainer = document.querySelector('#cashflow-chart .cashflow-bars');
    const arrLabelsContainer = document.querySelector('#arr-chart .arr-labels');
    const cashflowLabelsContainer = document.querySelector('#cashflow-chart .cashflow-labels');
    const tableBody = document.querySelector('.financial-summary tbody'); // Cache table body

    // --- Scenario Data Store ---
    let currentScenario = 1;
    let mainUpdateInterval = null;

    // --- New Quarterly Data Store ---
    const quarterlyDataStore = {
        scenario1: {
            arr: [
                /* 2024A */ 0.25, 0.50, 0.75, 1.00,
                /* 2025E */ 1.78, 2.56, 3.34, 4.12,
                /* 2026E */ 4.80, 6.30, 7.80, 9.30,
                /* 2027E */ 9.80, 11.10, 12.40, 13.70,
                /* 2028E */ 15.55, 18.10, 20.65, 23.20
            ].map(v => v * 1000000), // Convert $MM to $
            cashflow: [
                /* 2024A */ -0.12, -0.14, -0.15, -0.18, // Updated OpCF
                /* 2025E */ -0.28, -0.39, -0.46, -0.56, // Updated OpCF
                /* 2026E */ -0.60, -0.66, -0.72, -0.73, // Updated OpCF
                /* 2027E */ -0.25,  0.10,  0.30,  0.45, // Updated OpCF
                /* 2028E */  0.55,  0.90,  1.25,  1.96  // Updated OpCF
            ].map(v => v * 1000000) // Convert $MM to $
        },
        scenario2: {
            arr: [
                /* 2024A */ 0.25, 0.50, 0.75, 1.00,
                /* 2025E */ 1.34, 1.68, 2.02, 2.36,
                /* 2026E */ 3.07, 4.13, 5.20, 6.26,
                /* 2027E */ 7.08, 8.28, 9.48, 10.68,
                /* 2028E */ 12.18, 14.16, 16.14, 18.12
            ].map(v => v * 1000000), // Convert $MM to $
            cashflow: [
                /* 2024A */ -0.12, -0.14, -0.15, -0.19, // Updated OpCF
                /* 2025E */ -0.40, -0.55, -0.70, -0.93, // Updated OpCF
                /* 2026E */ -1.05, -1.18, -1.30, -1.54, // Updated OpCF
                /* 2027E */ -1.10, -0.85, -0.65, -0.36, // Updated OpCF
                /* 2028E */ -0.32, -0.40, -0.45, -0.40  // Updated OpCF
            ].map(v => v * 1000000) // Convert $MM to $
        }
    };
    // --- End New Quarterly Data Store ---

    const scenarios = {
        scenario1: {}, // Will store the initial HTML values (Annual)
        scenario2: { // Updated Scenario 2 data (Annual for Table Update)
            // Format: metricName_Year: value (raw value, matching HTML data-value expectations)
            // NOTE: 2024A data is ignored here as only 2025E-2028E are updated by scenario switch

            // --- Scenario 2 ANNUAL Table Data (Derived from quarterly where needed) ---
            // 2025E
            "BeginningARR_2025E": 1.0, // From Scenario 2 2024Q4 ARR
            "NewARR_2025E": 1.36, // Directly provided
            "ExpansionARR_2025E": 0.04, // Directly provided
            "ChurnedARR_2025E": -0.12, // Directly provided
            "EndingARR_2025E": 2.28, // Directly provided (matches 2025Q4 ARR 2.36 rounded? -> using provided 2.28 for consistency with old data)
            "ARRGrowthPct_2025E": 128.0, // Directly provided
            "GrossRetentionPct_2025E": 88.0, // Directly provided
            "NetRetentionPct_2025E": 92.0, // Directly provided
            "AverageContractValueK_2025E": 31.6, // Directly provided
            "EndingCustomers_2025E": 72, // Directly provided
            "Revenue_2025E": 1.64, // Directly provided
            "COGS_2025E": 0.377, // Directly provided
            "GrossProfit_2025E": 1.263, // Directly provided
            "GrossMarginPct_2025E": 77.0, // Directly provided
            "TotalR&D_2025E": 1.60, // Directly provided
            "TotalS&M_2025E": 1.85, // Directly provided
            "TotalG&A_2025E": 0.52, // Directly provided
            "TotalOperatingExp_2025E": 3.97, // Sum of R&D, S&M, G&A
            "NetIncome_2025E": -2.677, // Directly provided
            "EndingCash_2025E": -1.262, // Directly provided
            "AvgMonthlyBurn_2025E": ((-0.40 -0.55 -0.70 -0.93) / 4).toFixed(3), // Avg quarterly burn (UPDATED)
            "TotalHeadcount_2025E": 36, // Directly provided
            "ARRperHead_2025E": (0.063 * 1000).toFixed(1),

            // 2026E
            "BeginningARR_2026E": 2.28, // From Scenario 2 2025 Ending ARR
            "NewARR_2026E": 3.97, // Directly provided
            "ExpansionARR_2026E": 0.25, // Directly provided
            "ChurnedARR_2026E": -0.30, // Directly provided
            "EndingARR_2026E": 6.20, // Directly provided (matches S2 2026Q4 ARR 6.26 rounded? -> using 6.20)
            "ARRGrowthPct_2026E": 171.9, // Directly provided
            "GrossRetentionPct_2026E": 86.8, // Directly provided
            "NetRetentionPct_2026E": 97.8, // Directly provided
            "AverageContractValueK_2026E": 34.0, // Directly provided
            "EndingCustomers_2026E": 182, // Directly provided
            "Revenue_2026E": 4.24, // Directly provided
            "COGS_2026E": 0.975, // Directly provided
            "GrossProfit_2026E": 3.265, // Directly provided
            "GrossMarginPct_2026E": 77.0, // Directly provided
            "TotalR&D_2026E": 3.30, // Directly provided
            "TotalS&M_2026E": 3.66, // Directly provided
            "TotalG&A_2026E": 1.37, // Directly provided
            "TotalOperatingExp_2026E": 8.33, // Sum of R&D, S&M, G&A
            "NetIncome_2026E": -5.065, // Directly provided
            "EndingCash_2026E": -6.327, // Directly provided
            "AvgMonthlyBurn_2026E": ((-1.05 -1.18 -1.30 -1.54) / 4).toFixed(3), // Avg quarterly burn (UPDATED)
            "TotalHeadcount_2026E": 70, // Directly provided
            "ARRperHead_2026E": (0.089 * 1000).toFixed(1),

            // 2027E
            "BeginningARR_2027E": 6.20, // From Scenario 2 2026 Ending ARR
            "NewARR_2027E": 4.90, // Directly provided
            "ExpansionARR_2027E": 0.90, // Directly provided
            "ChurnedARR_2027E": -0.60, // Directly provided
            "EndingARR_2027E": 11.40, // Directly provided (matches S2 2027Q4 ARR 10.68 rounded? -> using 11.40)
            "ARRGrowthPct_2027E": 83.9, // Directly provided
            "GrossRetentionPct_2027E": 90.3, // Directly provided
            "NetRetentionPct_2027E": 104.8, // Directly provided
            "AverageContractValueK_2027E": 37.0, // Directly provided
            "EndingCustomers_2027E": 308, // Directly provided
            "Revenue_2027E": 8.80, // Directly provided
            "COGS_2027E": 1.936, // Directly provided
            "GrossProfit_2027E": 6.864, // Directly provided
            "GrossMarginPct_2027E": 78.0, // Directly provided
            "TotalR&D_2027E": 3.38, // Directly provided
            "TotalS&M_2027E": 3.99, // Directly provided
            "TotalG&A_2027E": 2.00, // Directly provided
            "TotalOperatingExp_2027E": 9.37, // Sum of R&D, S&M, G&A
            "NetIncome_2027E": -2.516, // Directly provided
            "EndingCash_2027E": -8.843, // Directly provided
            "AvgMonthlyBurn_2027E": ((-1.10 -0.85 -0.65 -0.36) / 4).toFixed(3), // Avg quarterly burn (UPDATED)
            "TotalHeadcount_2027E": 100, // Directly provided
            "ARRperHead_2027E": (0.114 * 1000).toFixed(1),

            // 2028E
            "BeginningARR_2028E": 11.40, // From Scenario 2 2027 Ending ARR
            "NewARR_2028E": 7.64, // Directly provided
            "ExpansionARR_2028E": 2.09, // Directly provided
            "ChurnedARR_2028E": -0.93, // Directly provided
            "EndingARR_2028E": 20.20, // Directly provided (matches S2 2028Q4 ARR 18.12 rounded? -> using 20.20)
            "ARRGrowthPct_2028E": 77.2, // Directly provided
            "GrossRetentionPct_2028E": 91.8, // Directly provided
            "NetRetentionPct_2028E": 110.2, // Directly provided
            "AverageContractValueK_2028E": 40.0, // Directly provided
            "EndingCustomers_2028E": 505, // Directly provided
            "Revenue_2028E": 15.80, // Directly provided
            "COGS_2028E": 3.476, // Directly provided
            "GrossProfit_2028E": 12.324, // Directly provided
            "GrossMarginPct_2028E": 78.0, // Directly provided
            "TotalR&D_2028E": 4.56, // Directly provided
            "TotalS&M_2028E": 5.68, // Directly provided
            "TotalG&A_2028E": 3.67, // Directly provided
            "TotalOperatingExp_2028E": 13.91, // Sum of R&D, S&M, G&A
            "NetIncome_2028E": -1.566, // Directly provided
            "EndingCash_2028E": -10.409, // Directly provided
            "AvgMonthlyBurn_2028E": ((-0.32 -0.40 -0.45 -0.40) / 4).toFixed(3), // Avg quarterly burn (UPDATED)
            "TotalHeadcount_2028E": 140, // Directly provided
            "ARRperHead_2028E": (0.144 * 1000).toFixed(1),
        }
    };

     // --- Store Initial HTML (Scenario 1 ANNUAL) Values --- //
    const storeScenario1AnnualValues = () => {
         scenarios.scenario1 = {};
          if (!tableBody) { return; }
          const dataRows = tableBody.querySelectorAll('tr[data-metric]');

          dataRows.forEach(row => {
             const metricName = row.getAttribute('data-metric');
             if (!metricName) return;

            const dataCells = row.querySelectorAll('td[data-value]');
             dataCells.forEach((cell, index) => {
                 const yearHeaderIndex = index + 1;
                 if (yearHeaderIndex < yearHeaders.length) {
                     const year = yearHeaders[yearHeaderIndex];
                     const key = `${metricName}_${year}`;
                     let value = cell.getAttribute('data-value');
                        // Store the raw data-value string
                        scenarios.scenario1[key] = value;
                }
            });
         });
     };

    // --- Formatting Function (Handles Units, Expects RAW Value from data-value) --- //
    const formatNumber = (rawValue, unit) => {
        // Handle specific string values first
        if (typeof rawValue === 'string' && rawValue.toLowerCase() === 'profitable') {
            return 'Profitable';
        }

        const numericValue = parseFloat(rawValue);

        // Handle null/NaN or 'null' string
        if (isNaN(numericValue) || rawValue === null || rawValue === 'null') {
            return '–';
        }

        let displayValue;
        let baseValueForSign = numericValue; // Used to check negativity
        let addParensForNegative = false;
        let prefix = '';
        let suffix = '';

        // Determine formatting based on the *unit* attribute
        switch (unit) {
            case '$ MM':
                baseValueForSign = numericValue * 1000000;
                displayValue = Math.abs(numericValue).toFixed(1);
                addParensForNegative = true;
                prefix = '$';
                suffix = 'M';
                break;
            case '$ MM/month':
                 baseValueForSign = numericValue * 1000000;
                 // Display burn in K for better readability if less than $1M
                 if (Math.abs(numericValue) < 1) {
                     displayValue = (Math.abs(numericValue) * 1000).toFixed(0); // Show K
                     suffix = 'K';
                 } else {
                     displayValue = Math.abs(numericValue).toFixed(1); // Show M
                     suffix = 'M';
                 }
                 addParensForNegative = true; // Still use parens for negative burn
                 prefix = '$';
                 break;
            case '$ K':
                baseValueForSign = numericValue * 1000;
                displayValue = Math.abs(numericValue).toFixed(1);
                addParensForNegative = true;
                prefix = '$';
                suffix = 'K';
                break;
            case '%':
                displayValue = Math.round(numericValue).toFixed(0);
                prefix = '';
                suffix = '%';
                break;
            case 'count':
            case 'FTE':
                displayValue = Math.round(numericValue).toLocaleString(undefined, { maximumFractionDigits: 0 });
                prefix = '';
                suffix = '';
                break;
            case '$': // For ARR per Head (rawValue is in K)
                 baseValueForSign = numericValue * 1000;
                 displayValue = Math.round(numericValue).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                 });
                 addParensForNegative = false; // ARR per head shouldn't be negative
                 prefix = '$';
                 suffix = 'K';
                 break;
            default:
                // Fallback for unhandled units or base numbers (like growth %)
                displayValue = numericValue.toLocaleString(undefined, { maximumFractionDigits: 1 });
                prefix = '';
                suffix = '';
                break;
        }

        let formattedString = `${prefix}${displayValue}${suffix}`;

        if (baseValueForSign < 0 && addParensForNegative) {
            return `(${formattedString})`; // Add parens around the formatted string
        }

        return formattedString;
    };

    // --- Helper to Parse Formatted Numbers back to RAW Numeric for data-value --- //
    const parseFormattedNumber = (formattedString) => {
        if (typeof formattedString !== 'string') return NaN;
        let cleanString = formattedString.trim();

        // Handle special display strings
        if (cleanString === '–' || cleanString === 'N/A' || cleanString.toLowerCase() === 'profitable') {
            return NaN; // Cannot animate these
        }

        let rawValue = NaN;
        let isNegative = false;

        // Handle parentheses for negative
        if (cleanString.startsWith('(') && cleanString.endsWith(')')) {
            isNegative = true;
            cleanString = cleanString.substring(1, cleanString.length - 1); // Remove parens
        }

         // Remove prefix ($) and suffix (M, K, %)
         if (cleanString.startsWith('$')) {
             cleanString = cleanString.substring(1);
         }
         let multiplier = 1;
         if (cleanString.endsWith('M')) {
             cleanString = cleanString.substring(0, cleanString.length - 1);
             multiplier = 1; // Parsed value is already in Millions for $MM
         } else if (cleanString.endsWith('K')) {
             cleanString = cleanString.substring(0, cleanString.length - 1);
             multiplier = 1; // Parsed value is already in Thousands for $K and $
         } else if (cleanString.endsWith('%')) {
             cleanString = cleanString.substring(0, cleanString.length - 1);
             multiplier = 1; // Parsed value is direct %
         }

        // Remove commas
        cleanString = cleanString.replace(/,/g, '');

        rawValue = parseFloat(cleanString);

        if (isNaN(rawValue)) return NaN;

        // Apply multiplier (should be 1 now, parsing back to raw)
        // rawValue *= multiplier;

        if (isNegative) {
            rawValue = -rawValue;
        }
        return rawValue;
    };

    // --- Calculate ARR per Head (for the currently displayed table data) --- //
    const calculateAndSetARRperHead = () => {
        const endingArrRow = findRowByMetric('EndingARR');
        const headcountRow = findRowByMetric('TotalHeadcount');
        const arrPerHeadRow = findRowByMetric('ARRperHead');

        if (!endingArrRow || !headcountRow || !arrPerHeadRow) {
            console.warn("Missing rows for ARR per Head calc");
            return;
        }

        const arrCells = endingArrRow.querySelectorAll('td[data-value]');
        const headcountCells = headcountRow.querySelectorAll('td[data-value]');
        const arrPerHeadCells = arrPerHeadRow.querySelectorAll('td[data-value]');

        if (arrCells.length !== 5 || headcountCells.length !== 5 || arrPerHeadCells.length !== 5) {
             console.warn("Incorrect cell count for ARR per Head calc");
             return;
        }

        for (let i = 0; i < 5; i++) {
            // Read current ANNUAL values from the table cells' data-value attributes
            const endingArrValue = parseFloat(arrCells[i].getAttribute('data-value')); // This is the raw value (e.g., 1.0 for $1M)
            const totalHeadcount = parseFloat(headcountCells[i].getAttribute('data-value')); // Direct headcount

            let calculatedArrPerHeadDollars = NaN; // Default to NaN
            // Use the *annual* ending ARR from the table (which is in millions)
            if (!isNaN(endingArrValue) && !isNaN(totalHeadcount) && totalHeadcount !== 0) {
                // Convert ARR from millions to dollars for calculation
                 calculatedArrPerHeadDollars = (endingArrValue * 1000000) / totalHeadcount;
            }

            // Update the data-value attribute - store the *raw calculated value* in THOUSANDS ($ K)
            const newValue = isNaN(calculatedArrPerHeadDollars)
                                ? 'null'
                                : (calculatedArrPerHeadDollars / 1000).toFixed(1); // Store as thousands string
            arrPerHeadCells[i].setAttribute('data-value', newValue);
        }
    };

    // --- Number Animation Function (Uses Unit, Animates BASE Values) --- //
    const animateCountUp = (el) => {
        if (!el) return;
        const parentRow = el.closest('tr');
        if (!parentRow) return;

        let dataValueStr = el.getAttribute('data-value'); // e.g., "1.0", "10.0", "100", "null", "Profitable"
        const unit = parentRow.getAttribute('data-unit') || '';

        // Handle non-numeric target strings DIRECTLY (no animation)
        if (dataValueStr === 'null' || dataValueStr === null || dataValueStr === undefined || dataValueStr.toLowerCase() === 'profitable') {
            el.textContent = formatNumber(dataValueStr, unit); // Use formatNumber to handle 'Profitable' or '–' display
            return;
        }

        // Target value calculation (RAW numeric value from data-value)
        let targetRawValue = parseFloat(dataValueStr);

        // No scaling needed here, formatNumber handles it based on unit

        // Handle Non-numeric target values after parse attempt
        if (isNaN(targetRawValue)) {
            el.textContent = formatNumber('null', unit); // Show '–'
            return;
        }

        // --- Animation Logic ---
        let startTimestamp = null;

        // --- Determine Start Value from Current Display (RAW numeric value) --- 
        const currentText = el.textContent;
        let startRawValue = parseFormattedNumber(currentText); // Returns raw value or NaN
        if (isNaN(startRawValue)) {
             startRawValue = 0; // Default start from 0 if current text not parseable
        }

        const endRawValue = targetRawValue; // Target is already raw value

        // Don't animate if start and end are effectively the same
        if (Math.abs(startRawValue - endRawValue) < 0.01) {
            // Format the RAW end value based on its unit for display
            el.textContent = formatNumber(endRawValue, unit);
            return;
        }

        // Set initial text to formatted start value
        try {
             el.textContent = formatNumber(startRawValue, unit); // Format the RAW start value
        } catch(e) {
             el.textContent = "Err";
        }

        const step = (timestamp) => {
            try {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / numberAnimationDuration, 1);
                // Animate between the raw numeric start and end values
                let currentAnimatedRawVal = progress * (endRawValue - startRawValue) + startRawValue;

                // Format the current animated RAW value using the unit
                el.textContent = formatNumber(currentAnimatedRawVal, unit);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                    // Ensure final value is exact and formatted correctly on completion
                    // Format the TARGET raw value for final display
                    el.textContent = formatNumber(targetRawValue, unit);
                }
            } catch(e) {
                 try { el.textContent = formatNumber(endRawValue, unit); } catch {} // Fallback on error
            }
        };
        window.requestAnimationFrame(step);
    };

    // --- Generate Quarterly Labels Helper --- //
    const generateQuarterlyLabels = () => {
        const labels = [];
        for (let year = 0; year < totalYears; year++) {
            const currentYear = startYear + year;
            const suffix = year === 0 ? actualSuffix : estimatedSuffix;
            for (let quarter = 1; quarter <= quartersPerYear; quarter++) {
                // Use full year
                labels.push(`Q${quarter} ${currentYear}${suffix}`);
            }
        }
        return labels;
    };

    // --- Get Chart Data Function (Pulls from Quarterly Store) ---
    const getChartData = () => {
        const scenarioKey = `scenario${currentScenario}`;
        const labels = generateQuarterlyLabels();

        const arrValues = quarterlyDataStore[scenarioKey]?.arr || [];
        const cashflowValues = quarterlyDataStore[scenarioKey]?.cashflow || [];

        if (arrValues.length !== totalQuarters || cashflowValues.length !== totalQuarters) {
            console.error(`Data mismatch for ${scenarioKey}. Expected ${totalQuarters} quarters.`);
            // Return empty data to prevent chart errors
             return {
                 arrData: { labels: labels, values: Array(totalQuarters).fill(0) },
                 cashflowData: { labels: labels, values: Array(totalQuarters).fill(0) }
             };
        }

        return {
            arrData: { labels: labels, values: arrValues },
            cashflowData: { labels: labels, values: cashflowValues }
        };
    };

    // --- Bar Chart Creation Function (Handles Quarterly Data) --- //
    const createChartBars = (data, container, labelsContainer, isCashflow = false) => {
        if (!container || !labelsContainer || !data || data.values.length === 0 || data.values.length !== data.labels.length) {
             console.warn("Chart generation skipped due to missing data/containers.", {data, container, labelsContainer});
             return;
        }
        container.innerHTML = ''; // Clear existing bars
        labelsContainer.innerHTML = ''; // Clear existing labels

        const fragment = document.createDocumentFragment();
        const labelFragment = document.createDocumentFragment();

        const values = data.values; // Expecting base dollar values here
        const labels = data.labels;
        const barCount = values.length;

        // Determine scale from base dollar values
        const allValues = values.map(v => v || 0);
        let maxVal = 0;
        let minVal = 0;
        if (isCashflow) {
            maxVal = Math.max(0, ...allValues);
            minVal = Math.min(0, ...allValues);
        } else { // ARR
            maxVal = Math.max(...allValues);
            minVal = 0; // ARR doesn't go below zero
        }

        // Use max absolute deviation for scaling, prevent zero division
        const maxAbsValue = Math.max(Math.abs(maxVal), Math.abs(minVal), 1); // Ensure not zero

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        if (containerWidth <= 0 || containerHeight <= 0) { console.warn("Chart container zero dimensions"); return; }

        const barSpacing = containerWidth / barCount;
        const barWidth = Math.max(2, barSpacing * 0.6);
        const barGap = barSpacing - barWidth;

        // --- Dynamic Zero Line for Cashflow --- 
        let zeroLineBottomPercent = 50; // Default for ARR or if range is zero
        if (isCashflow) {
            const dataRange = maxVal - minVal;
            if (dataRange > 1) { // Avoid division by zero or tiny ranges
                // Calculate ideal zero line position based on negative proportion
                let dynamicZeroLine = (Math.abs(minVal) / dataRange) * 100;
                // Clamp the line position to prevent extremes (e.g., 20% to 80%)
                zeroLineBottomPercent = Math.max(20, Math.min(80, dynamicZeroLine));
            } else if (maxVal === 0 && minVal === 0) {
                zeroLineBottomPercent = 50; // Center if all zero
            } else if (maxVal > 0) {
                 zeroLineBottomPercent = 20; // Mostly positive, push line down
            } else {
                 zeroLineBottomPercent = 80; // Mostly negative, push line up
            }
        }
        // ------------------------------------

        // --- Scaling based on dynamic zero line for cashflow ---
        let scalePositive = 100 / maxAbsValue; // Default scale
        let scaleNegative = 100 / maxAbsValue; // Default scale

        if (isCashflow && maxAbsValue > 0) { // Check maxAbsValue > 0 to prevent division by zero
            // Calculate scaling based on available space above/below the dynamic zero line
            scalePositive = maxVal > 0 ? (100 - zeroLineBottomPercent) / maxVal : 0; // Scale positive part to space above zero
            scaleNegative = minVal < 0 ? zeroLineBottomPercent / Math.abs(minVal) : 0; // Scale negative part to space below zero
        }
        // -----------------------------------------------------

        values.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            const itemValue = value || 0; // Base dollar value

            let heightPercentage = 0;
            let bottomPositionPercent = 0;
            let topPositionPercent = null; // Use null to unset

            if (isCashflow) {
                let rawHeightPercentage = Math.abs(itemValue) * (itemValue >= 0 ? scalePositive : scaleNegative);

                // Determine position based on value
                if (itemValue >= 0) {
                    bar.classList.add('positive');
                    bar.classList.remove('negative');
                    // Position based on dynamic zero line
                    bottomPositionPercent = zeroLineBottomPercent;
                    topPositionPercent = null;
                    heightPercentage = itemValue * scalePositive; // Use new positive scale
                } else {
                    bar.classList.add('negative');
                    bar.classList.remove('positive');
                     // Position based on dynamic zero line
                    topPositionPercent = (100 - zeroLineBottomPercent);
                    bottomPositionPercent = null;
                    // Use new negative scale, cap height to space below zero
                    heightPercentage = Math.min(Math.abs(itemValue) * scaleNegative, zeroLineBottomPercent - 1); // Leave 1% gap
                 }

                 // Set color based directly on value
                 if (itemValue >= 0) {
                     bar.style.backgroundColor = 'var(--excel-positive-green)';
                 } else {
                     bar.style.backgroundColor = 'var(--excel-negative-red)';
                 }

            } else { // ARR Chart
                heightPercentage = itemValue * scalePositive; // Use positive scale (scaled to 100% height)
                bottomPositionPercent = 0; // Always starts from bottom
                topPositionPercent = null; // Unset top
                bar.style.backgroundColor = 'var(--excel-chart-blue)'; // Use standard blue
             }

            // Apply styles
            bar.style.position = 'absolute';
            bar.style.left = `${index * barSpacing + barGap / 2}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.height = `0%`; // Start height at 0 for animation

            // Set bottom or top based on cashflow type / ARR
             if (topPositionPercent !== null) {
                 bar.style.top = `${topPositionPercent}%`;
                 bar.style.bottom = ''; // Unset bottom
             } else {
                 bar.style.bottom = `${bottomPositionPercent}%`;
                 bar.style.top = ''; // Unset top
             }

            // Append bar
            fragment.appendChild(bar);

            // Animate bar height after appending
            setTimeout(() => {
                 bar.style.height = `${Math.max(0, heightPercentage)}%`; // Ensure height isn't negative
            }, 50 + index * (numberAnimationDuration / barCount / 2)); // Stagger animation

            // Create Labels - Only for Q1 of each year
            if (index % quartersPerYear === 0) {
            const label = document.createElement('span');
                 label.textContent = labels[index];
            label.style.position = 'absolute';
                 // Position under the first bar of the year
                 label.style.left = `${index * barSpacing + barSpacing / 2}px`;
                 label.style.bottom = '0';
            label.style.whiteSpace = 'nowrap';
                 // label.style.fontSize = '9pt'; // Set font size in CSS
                 label.style.transform = 'translateX(-50%) translateY(100%)'; // Center below bar, no rotation
                 // label.style.transformOrigin = 'center'; // Not needed without rotation
            labelFragment.appendChild(label);
            }
        });

        container.appendChild(fragment);
        labelsContainer.appendChild(labelFragment);
    };

    // --- Utility to find table row by metric attribute --- //
    const findRowByMetric = (metric) => {
        if (!tableBody) return null;
        return tableBody.querySelector(`tr[data-metric="${metric}"]`);
    }

    // --- Redraw Charts based on current scenario's quarterly data --- //
    const redrawCharts = () => {
         try {
             const { arrData, cashflowData } = getChartData(); // Get data for current scenario

              // === Log Generated Chart Data ===
              console.log(`Chart Data for Scenario ${currentScenario}:`, {
                  arrValues: arrData.values.slice(0, 5).concat(arrData.values.slice(-5)), // Log first 5 and last 5
                  cashflowValues: cashflowData.values.slice(0, 5).concat(cashflowData.values.slice(-5)) // Log first 5 and last 5
              });
              // ================================

             createChartBars(arrData, arrChartContainer, arrLabelsContainer, false);
             createChartBars(cashflowData, cashflowChartContainer, cashflowLabelsContainer, true);
         } catch(e) {
             console.error("Error redrawing charts:", e);
         }
    }

    // --- Dashboard Update Function (Handles Scenario Switching for Table) --- //
    const updateDashboard = () => {
         currentScenario = currentScenario === 1 ? 2 : 1;
         const targetScenarioAnnualData = scenarios[`scenario${currentScenario}`]; // Use ANNUAL data for table
         const cellsToUpdate = []; // Keep track of cells whose values change

         if (!tableBody || !targetScenarioAnnualData) {
             console.error("Missing table body or scenario data for update.");
             return;
         }

         // Iterate over the ANNUAL scenario data to update the TABLE cells
         Object.keys(targetScenarioAnnualData).forEach(key => {
             const [metricName, year] = key.split('_');
             if (!metricName || !year) return;

             const row = findRowByMetric(metricName); // Find row using data-metric
             if (row) {
                 const headerIndex = yearIndices[year];
                 if (headerIndex !== undefined && headerIndex > 0) { // Ensure valid year index > 0
                     const cell = row.querySelector(`td:nth-child(${headerIndex + 1})`);
                     if (cell && cell.hasAttribute('data-value')) {
                         const newValue = String(targetScenarioAnnualData[key]); // Ensure it's a string (using raw annual values)
                         const oldValue = cell.getAttribute('data-value');
                         if (newValue !== oldValue) {
                             cell.setAttribute('data-value', newValue);
                             cellsToUpdate.push(cell); // Add to list for re-animation/update
                         }
                     }
                 }
             }
         });

         // Recalculate ARR per Head based on the updated ANNUAL table data
         try {
            calculateAndSetARRperHead();
            // Add the ARR per Head cells to the update list if they weren't already updated by scenario data
             const arrPerHeadRow = findRowByMetric('ARRperHead');
             if (arrPerHeadRow) {
                 arrPerHeadRow.querySelectorAll('td[data-value]').forEach(cell => {
                     if (!cellsToUpdate.includes(cell)) {
                         cellsToUpdate.push(cell);
                     }
                 });
             }
         } catch (e) {
             console.error("Error recalculating ARR per Head:", e);
         }

         // Apply updates/animations to only the changed table cells
         cellsToUpdate.forEach(cell => {
             try {
                animateCountUp(cell);
             } catch(e) {
                 console.error("Error animating cell:", cell, e);
             }
         });

         // Redraw charts using the QUARTERLY data for the *newly set* currentScenario
         redrawCharts();
     };

    // --- Initial Draw Function --- //
    const initializeDashboard = () => {
        storeScenario1AnnualValues(); // Store initial ANNUAL data from HTML

        try {
             calculateAndSetARRperHead(); // Calculate based on initial annual data
        } catch (e) {
             console.error("Error calculating initial ARR per Head:", e);
        }

        // 3. Apply initial formatting/animation to all table cells based on initial annual data
        document.querySelectorAll('.financial-summary td[data-value]').forEach(cell => {
            try {
                animateCountUp(cell);
            } catch (e) {
                console.error("Error animating initial cell:", cell, e);
                if (cell) cell.textContent = 'Err';
            }
        });

        // 4. Draw initial charts based on Scenario 1 QUARTERLY data
        currentScenario = 1; // Ensure we start with scenario 1 charts
        redrawCharts();

        // 5. Start the scenario switching interval
        if (mainUpdateInterval) clearInterval(mainUpdateInterval);
         console.log(`Starting scenario switch interval (${updateIntervalTime}ms)...`);
        mainUpdateInterval = setInterval(updateDashboard, updateIntervalTime);
    };

    // --- Initialization & Resize Handling --- //
    initializeDashboard();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        if (mainUpdateInterval) {
            console.log("Clearing interval due to resize.");
            clearInterval(mainUpdateInterval);
        }
        resizeTimer = setTimeout(() => {
            console.log("Re-initializing dashboard after resize.");
            initializeDashboard(); // Re-initialize completely on resize
        }, 500);
    });
});