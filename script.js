function initializeFinancialModel(containerId) {
    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
        console.error(`Financial model container with ID '${containerId}' not found.`);
        return null; // Return null or an object with control methods if needed
    }

    // --- Global State & Configuration (Scoped to this instance) ---
    const numberAnimationDuration = 800;
    const updateIntervalTime = 2500; // Interval for scenario switching
    const quartersPerYear = 4;
    const totalYears = 5;
    const totalQuarters = totalYears * quartersPerYear;
    const startYear = 2024;
    const actualSuffix = 'A';
    const estimatedSuffix = 'E';
    const yearHeaders = ["Metric", "2024A", "2025E", "2026E", "2027E", "2028E"];
    const projectedYears = ['2025E', '2026E', '2027E', '2028E'];
    const yearIndices = {};
    yearHeaders.forEach((year, index) => { yearIndices[year] = index; });

    // --- DOM Elements (Scoped to containerElement) --- //
    const allCounters = containerElement.querySelectorAll('.financial-summary td[data-value]');
    const arrChartContainer = containerElement.querySelector('#arr-chart .arr-bars');
    const cashflowChartContainer = containerElement.querySelector('#cashflow-chart .cashflow-bars');
    const arrLabelsContainer = containerElement.querySelector('#arr-chart .arr-labels');
    const cashflowLabelsContainer = containerElement.querySelector('#cashflow-chart .cashflow-labels');
    const tableBody = containerElement.querySelector('.financial-summary tbody');

    // --- Scenario Data Store (Remains the same, scoped) ---
    let currentScenario = 1;
    let mainUpdateInterval = null;
    let resizeTimer = null;

    // --- New Quarterly Data Store (Remains the same, scoped) ---
    const quarterlyDataStore = {
        scenario1: {
            arr: [
                /* 2024A */ 0.25, 0.50, 0.75, 1.00,
                /* 2025E */ 1.78, 2.56, 3.34, 4.12,
                /* 2026E */ 4.80, 6.30, 7.80, 9.30,
                /* 2027E */ 9.80, 11.10, 12.40, 13.70,
                /* 2028E */ 15.55, 18.10, 20.65, 23.20
            ].map(v => v * 1000000),
            cashflow: [
                /* 2024A */ -0.12, -0.14, -0.15, -0.18,
                /* 2025E */ -0.28, -0.39, -0.46, -0.56,
                /* 2026E */ -0.60, -0.66, -0.72, -0.73,
                /* 2027E */ -0.25,  0.10,  0.30,  0.45,
                /* 2028E */  0.55,  0.90,  1.25,  1.96
            ].map(v => v * 1000000)
        },
        scenario2: {
            arr: [
                /* 2024A */ 0.25, 0.50, 0.75, 1.00,
                /* 2025E */ 1.34, 1.68, 2.02, 2.36,
                /* 2026E */ 3.07, 4.13, 5.20, 6.26,
                /* 2027E */ 7.08, 8.28, 9.48, 10.68,
                /* 2028E */ 12.18, 14.16, 16.14, 18.12
            ].map(v => v * 1000000),
            cashflow: [
                /* 2024A */ -0.12, -0.14, -0.15, -0.19,
                /* 2025E */ -0.40, -0.55, -0.70, -0.93,
                /* 2026E */ -1.05, -1.18, -1.30, -1.54,
                /* 2027E */ -1.10, -0.85, -0.65, -0.36,
                /* 2028E */ -0.32, -0.40, -0.45, -0.40
            ].map(v => v * 1000000)
        }
    };

    const scenarios = {
        scenario1: {}, // Will store the initial HTML values (Annual)
        scenario2: { // Updated Scenario 2 data (Annual for Table Update)
            // Format: metricName_Year: value (raw value, matching HTML data-value expectations)
            // NOTE: 2024A data is ignored here as only 2025E-2028E are updated by scenario switch

            // --- Scenario 2 ANNUAL Table Data (Derived from quarterly where needed) ---
            // 2025E
            "BeginningARR_2025E": 1.0,
            "NewARR_2025E": 1.36,
            "ExpansionARR_2025E": 0.04,
            "ChurnedARR_2025E": -0.12,
            "EndingARR_2025E": 2.28,
            "ARRGrowthPct_2025E": 128.0,
            "GrossRetentionPct_2025E": 88.0,
            "NetRetentionPct_2025E": 92.0,
            "AverageContractValueK_2025E": 31.6,
            "EndingCustomers_2025E": 72,
            "Revenue_2025E": 1.64,
            "COGS_2025E": 0.377,
            "GrossProfit_2025E": 1.263,
            "GrossMarginPct_2025E": 77.0,
            "TotalR&D_2025E": 1.60,
            "TotalS&M_2025E": 1.85,
            "TotalG&A_2025E": 0.52,
            "TotalOperatingExp_2025E": 3.97,
            "NetIncome_2025E": -2.677,
            "EndingCash_2025E": -1.262,
            "AvgMonthlyBurn_2025E": ((-0.40 -0.55 -0.70 -0.93) / 4).toFixed(3),
            "TotalHeadcount_2025E": 36,
            "ARRperHead_2025E": (0.063 * 1000).toFixed(1),

            // 2026E
            "BeginningARR_2026E": 2.28,
            "NewARR_2026E": 3.97,
            "ExpansionARR_2026E": 0.25,
            "ChurnedARR_2026E": -0.30,
            "EndingARR_2026E": 6.20,
            "ARRGrowthPct_2026E": 171.9,
            "GrossRetentionPct_2026E": 86.8,
            "NetRetentionPct_2026E": 97.8,
            "AverageContractValueK_2026E": 34.0,
            "EndingCustomers_2026E": 182,
            "Revenue_2026E": 4.24,
            "COGS_2026E": 0.975,
            "GrossProfit_2026E": 3.265,
            "GrossMarginPct_2026E": 77.0,
            "TotalR&D_2026E": 3.30,
            "TotalS&M_2026E": 3.66,
            "TotalG&A_2026E": 1.37,
            "TotalOperatingExp_2026E": 8.33,
            "NetIncome_2026E": -5.065,
            "EndingCash_2026E": -6.327,
            "AvgMonthlyBurn_2026E": ((-1.05 -1.18 -1.30 -1.54) / 4).toFixed(3),
            "TotalHeadcount_2026E": 70,
            "ARRperHead_2026E": (0.089 * 1000).toFixed(1),

            // 2027E
            "BeginningARR_2027E": 6.20,
            "NewARR_2027E": 4.90,
            "ExpansionARR_2027E": 0.90,
            "ChurnedARR_2027E": -0.60,
            "EndingARR_2027E": 11.40,
            "ARRGrowthPct_2027E": 83.9,
            "GrossRetentionPct_2027E": 90.3,
            "NetRetentionPct_2027E": 104.8,
            "AverageContractValueK_2027E": 37.0,
            "EndingCustomers_2027E": 308,
            "Revenue_2027E": 8.80,
            "COGS_2027E": 1.936,
            "GrossProfit_2027E": 6.864,
            "GrossMarginPct_2027E": 78.0,
            "TotalR&D_2027E": 3.38,
            "TotalS&M_2027E": 3.99,
            "TotalG&A_2027E": 2.00,
            "TotalOperatingExp_2027E": 9.37,
            "NetIncome_2027E": -2.516,
            "EndingCash_2027E": -8.843,
            "AvgMonthlyBurn_2027E": ((-1.10 -0.85 -0.65 -0.36) / 4).toFixed(3),
            "TotalHeadcount_2027E": 100,
            "ARRperHead_2027E": (0.114 * 1000).toFixed(1),

            // 2028E
            "BeginningARR_2028E": 11.40,
            "NewARR_2028E": 7.64,
            "ExpansionARR_2028E": 2.09,
            "ChurnedARR_2028E": -0.93,
            "EndingARR_2028E": 20.20,
            "ARRGrowthPct_2028E": 77.2,
            "GrossRetentionPct_2028E": 91.8,
            "NetRetentionPct_2028E": 110.2,
            "AverageContractValueK_2028E": 40.0,
            "EndingCustomers_2028E": 505,
            "Revenue_2028E": 15.80,
            "COGS_2028E": 3.476,
            "GrossProfit_2028E": 12.324,
            "GrossMarginPct_2028E": 78.0,
            "TotalR&D_2028E": 4.56,
            "TotalS&M_2028E": 5.68,
            "TotalG&A_2028E": 3.67,
            "TotalOperatingExp_2028E": 13.91,
            "NetIncome_2028E": -1.566,
            "EndingCash_2028E": -10.409,
            "AvgMonthlyBurn_2028E": ((-0.32 -0.40 -0.45 -0.40) / 4).toFixed(3),
            "TotalHeadcount_2028E": 140,
            "ARRperHead_2028E": (0.144 * 1000).toFixed(1),
        }
    };

    // --- Store Initial HTML (Scenario 1 ANNUAL) Values (Scoped) --- //
    const storeScenario1AnnualValues = () => {
         scenarios.scenario1 = {};
          if (!tableBody) { return; }
          const dataRows = tableBody.querySelectorAll('tr[data-metric]');

          dataRows.forEach(row => {
             const metricName = row.getAttribute('data-metric');
             if (!metricName) return;

            const dataCells = row.querySelectorAll('td[data-value]');
             dataCells.forEach((cell, index) => {
                 const yearHeaderIndex = index + 1; // Get column index (1-based for yearHeaders)
                 if (yearHeaderIndex >= 1 && yearHeaderIndex < yearHeaders.length) { // Check valid range (excluding metric name col 0)
                     const year = yearHeaders[yearHeaderIndex];
                     const key = `${metricName}_${year}`;
                     let value = cell.getAttribute('data-value');
                     scenarios.scenario1[key] = value; // Store raw string
                 }
            });
         });
     };

    // --- Formatting Function (Scoped) --- //
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
                prefix = '$ '; // Add space for alignment
                suffix = 'M';
                break;
            case '$ MM/month':
                 baseValueForSign = numericValue * 1000000;
                 if (Math.abs(numericValue) < 1) {
                     displayValue = (Math.abs(numericValue) * 1000).toFixed(0); // Show K
                     suffix = 'K';
                 } else {
                     displayValue = Math.abs(numericValue).toFixed(1); // Show M
                     suffix = 'M';
                 }
                 addParensForNegative = true; // Still use parens for negative burn
                 prefix = '$ '; // Add space
                 break;
            case '$ K':
                baseValueForSign = numericValue * 1000;
                displayValue = Math.abs(numericValue).toFixed(1);
                addParensForNegative = true;
                prefix = '$ '; // Add space
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
                 addParensForNegative = false;
                 prefix = '$ '; // Add space
                 suffix = 'K';
                 break;
            default:
                displayValue = numericValue.toLocaleString(undefined, { maximumFractionDigits: 1 });
                prefix = '';
                suffix = '';
                break;
        }

        let formattedString = `${prefix}${displayValue}${suffix}`;

        if (baseValueForSign < 0 && addParensForNegative) {
            return `(${formattedString.trim()})`; // Trim space inside parens
        }

        return formattedString;
    };

    // --- Helper to Parse Formatted Numbers (Scoped) --- //
    const parseFormattedNumber = (formattedString) => {
        if (typeof formattedString !== 'string') return NaN;
        let cleanString = formattedString.trim();

        if (cleanString === '–' || cleanString === 'N/A' || cleanString.toLowerCase() === 'profitable') {
            return NaN;
        }

        let rawValue = NaN;
        let isNegative = false;

        if (cleanString.startsWith('(') && cleanString.endsWith(')')) {
            isNegative = true;
            cleanString = cleanString.substring(1, cleanString.length - 1);
        }

         if (cleanString.startsWith('$')) {
             cleanString = cleanString.substring(1).trim(); // Trim potential space after $
         }
         if (cleanString.endsWith('M')) {
             cleanString = cleanString.substring(0, cleanString.length - 1);
         } else if (cleanString.endsWith('K')) {
             cleanString = cleanString.substring(0, cleanString.length - 1);
         } else if (cleanString.endsWith('%')) {
             cleanString = cleanString.substring(0, cleanString.length - 1);
         }

        cleanString = cleanString.replace(/,/g, '');

        rawValue = parseFloat(cleanString);

        if (isNaN(rawValue)) return NaN;

        if (isNegative) {
            rawValue = -rawValue;
        }
        return rawValue;
    };

    // --- Utility to find table row by metric attribute (Scoped) --- //
    const findRowByMetric = (metric) => {
        if (!tableBody) return null;
        // Use scoped selector
        return tableBody.querySelector(`tr[data-metric="${metric}"]`);
    }

    // --- Calculate ARR per Head (Scoped) --- //
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

        // Ensure we only look at the 5 data columns
        if (arrCells.length !== 5 || headcountCells.length !== 5 || arrPerHeadCells.length !== 5) {
            console.warn("Incorrect cell count for ARR per Head calc");
            return;
        }

        for (let i = 0; i < 5; i++) {
            const endingArrValue = parseFloat(arrCells[i].getAttribute('data-value'));
            const totalHeadcount = parseFloat(headcountCells[i].getAttribute('data-value'));

            let calculatedArrPerHeadDollars = NaN;
            if (!isNaN(endingArrValue) && !isNaN(totalHeadcount) && totalHeadcount !== 0) {
                 calculatedArrPerHeadDollars = (endingArrValue * 1000000) / totalHeadcount;
            }

            const newValue = isNaN(calculatedArrPerHeadDollars)
                                ? 'null'
                                : (calculatedArrPerHeadDollars / 1000).toFixed(1);
            arrPerHeadCells[i].setAttribute('data-value', newValue);
        }
    };

    // --- Number Animation Function (Scoped) --- //
    const animateCountUp = (el) => {
        if (!el) return;
        const parentRow = el.closest('tr');
        if (!parentRow) return;

        let dataValueStr = el.getAttribute('data-value');
        const unit = parentRow.getAttribute('data-unit') || '';

        if (dataValueStr === 'null' || dataValueStr === null || dataValueStr === undefined || dataValueStr.toLowerCase() === 'profitable') {
            el.textContent = formatNumber(dataValueStr, unit);
            return;
        }

        let targetRawValue = parseFloat(dataValueStr);

        if (isNaN(targetRawValue)) {
            el.textContent = formatNumber('null', unit);
            return;
        }

        let startTimestamp = null;
        const currentText = el.textContent;
        let startRawValue = parseFormattedNumber(currentText);
        if (isNaN(startRawValue)) {
             startRawValue = 0;
        }

        const endRawValue = targetRawValue;

        if (Math.abs(startRawValue - endRawValue) < 0.01) {
            el.textContent = formatNumber(endRawValue, unit);
            return;
        }

        try {
             el.textContent = formatNumber(startRawValue, unit);
        } catch(e) {
             el.textContent = "Err";
        }

        const step = (timestamp) => {
            try {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / numberAnimationDuration, 1);
            let currentAnimatedRawVal = progress * (endRawValue - startRawValue) + startRawValue;
            el.textContent = formatNumber(currentAnimatedRawVal, unit);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = formatNumber(targetRawValue, unit);
            }
            } catch(e) {
                 try { el.textContent = formatNumber(endRawValue, unit); } catch {} // Fallback on error
            }
        };
        window.requestAnimationFrame(step);
    };

    // --- Generate Quarterly Labels Helper (Scoped) --- //
    const generateQuarterlyLabels = () => {
        const labels = [];
        for (let year = 0; year < totalYears; year++) {
            const currentYear = startYear + year;
            const suffix = year === 0 ? actualSuffix : estimatedSuffix;
            for (let quarter = 1; quarter <= quartersPerYear; quarter++) {
                labels.push(`Q${quarter} ${currentYear}${suffix}`);
            }
        }
        return labels;
    };

    // --- Get Chart Data Function (Scoped) --- //
    const getChartData = () => {
        const scenarioKey = `scenario${currentScenario}`;
        const labels = generateQuarterlyLabels();

        const arrValues = quarterlyDataStore[scenarioKey]?.arr || [];
        const cashflowValues = quarterlyDataStore[scenarioKey]?.cashflow || [];

        if (arrValues.length !== totalQuarters || cashflowValues.length !== totalQuarters) {
            console.error(`Data mismatch for ${scenarioKey}. Expected ${totalQuarters} quarters.`);
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

    // --- Bar Chart Creation Function (Scoped) --- //
    const createChartBars = (data, container, labelsContainer, isCashflow = false) => {
        if (!container || !labelsContainer || !data || data.values.length === 0 || data.values.length !== data.labels.length) {
             console.warn("Chart generation skipped due to missing data/containers.", {data, container, labelsContainer});
             return;
        }
        container.innerHTML = ''; // Clear existing bars
        labelsContainer.innerHTML = ''; // Clear existing labels

        const fragment = document.createDocumentFragment();
        const labelFragment = document.createDocumentFragment();

        const values = data.values;
        const labels = data.labels;
        const barCount = values.length;

        const allValues = values.map(v => v || 0);
        let maxVal = 0;
        let minVal = 0;
        if (isCashflow) {
            maxVal = Math.max(0, ...allValues);
            minVal = Math.min(0, ...allValues);
        } else { // ARR
            maxVal = Math.max(...allValues);
            minVal = 0;
        }

        const maxAbsValue = Math.max(Math.abs(maxVal), Math.abs(minVal), 1);

        // Use containerElement for dimensions
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        if (containerWidth <= 0 || containerHeight <= 0) { console.warn("Chart container zero dimensions"); return; }

        const barSpacing = containerWidth / barCount;
        const barWidth = Math.max(2, barSpacing * 0.6);
        const barGap = barSpacing - barWidth;

        let zeroLineBottomPercent = 50;
        if (isCashflow) {
            const dataRange = maxVal - minVal;
            if (dataRange > 1) {
                let dynamicZeroLine = (Math.abs(minVal) / dataRange) * 100;
                zeroLineBottomPercent = Math.max(20, Math.min(80, dynamicZeroLine));
            } else if (maxVal === 0 && minVal === 0) {
                zeroLineBottomPercent = 50;
            } else if (maxVal > 0) {
                 zeroLineBottomPercent = 20;
            } else {
                 zeroLineBottomPercent = 80;
            }
        }

        let scalePositive = 100 / maxAbsValue;
        let scaleNegative = 100 / maxAbsValue;

        if (isCashflow && maxAbsValue > 0) {
            scalePositive = maxVal > 0 ? (100 - zeroLineBottomPercent) / maxVal : 0;
            scaleNegative = minVal < 0 ? zeroLineBottomPercent / Math.abs(minVal) : 0;
        }

        values.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            const itemValue = value || 0;

            let heightPercentage = 0;
            let bottomPositionPercent = 0;
            let topPositionPercent = null;

            if (isCashflow) {
                if (itemValue >= 0) {
                    bar.classList.add('positive');
                    bar.classList.remove('negative');
                    bottomPositionPercent = zeroLineBottomPercent;
                    topPositionPercent = null;
                    heightPercentage = itemValue * scalePositive;
                    bar.style.backgroundColor = 'var(--excel-positive-green)';
                } else {
                    bar.classList.add('negative');
                    bar.classList.remove('positive');
                    topPositionPercent = (100 - zeroLineBottomPercent);
                    bottomPositionPercent = null;
                    heightPercentage = Math.min(Math.abs(itemValue) * scaleNegative, zeroLineBottomPercent - 1);
                    bar.style.backgroundColor = 'var(--excel-negative-red)';
                 }
            } else { // ARR Chart
                heightPercentage = itemValue * scalePositive;
                bottomPositionPercent = 0;
                topPositionPercent = null;
                bar.style.backgroundColor = 'var(--excel-chart-blue)';
             }

            bar.style.position = 'absolute';
            bar.style.left = `${index * barSpacing + barGap / 2}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.height = `0%`;

             if (topPositionPercent !== null) {
                 bar.style.top = `${topPositionPercent}%`;
                 bar.style.bottom = '';
             } else {
                 bar.style.bottom = `${bottomPositionPercent}%`;
                 bar.style.top = '';
             }

            fragment.appendChild(bar);

            setTimeout(() => {
                 bar.style.height = `${Math.max(0, heightPercentage)}%`;
            }, 50 + index * (numberAnimationDuration / barCount / 2));

            if (index % quartersPerYear === 0) {
                const label = document.createElement('span');
                label.textContent = labels[index];
                label.style.position = 'absolute';
                label.style.left = `${index * barSpacing + barSpacing / 2}px`;
                label.style.bottom = '0';
                label.style.whiteSpace = 'nowrap';
                label.style.transform = 'translateX(-50%) translateY(100%)';
                labelFragment.appendChild(label);
            }
        });

        container.appendChild(fragment);
        labelsContainer.appendChild(labelFragment);
    };

    // --- Redraw Charts (Scoped) --- //
    const redrawCharts = () => {
         try {
             const { arrData, cashflowData } = getChartData();
             // Uses scoped DOM elements
             createChartBars(arrData, arrChartContainer, arrLabelsContainer, false);
             createChartBars(cashflowData, cashflowChartContainer, cashflowLabelsContainer, true);
         } catch(e) {
             console.error("Error redrawing charts:", e);
         }
    }

    // --- Dashboard Update Function (Scoped) --- //
    const updateDashboard = () => {
         currentScenario = currentScenario === 1 ? 2 : 1;
         const targetScenarioAnnualData = scenarios[`scenario${currentScenario}`];
         const cellsToUpdate = [];

         if (!tableBody || !targetScenarioAnnualData) {
             console.error("Missing table body or scenario data for update.");
             return;
         }

         Object.keys(targetScenarioAnnualData).forEach(key => {
             const [metricName, year] = key.split('_');
             if (!metricName || !year) return;

             const row = findRowByMetric(metricName);
             if (row) {
                 const headerIndex = yearIndices[year]; // Get column index (0=Metric, 1=2024A, etc.)
                 if (headerIndex !== undefined && headerIndex > 0) { // Check if valid year index
                     // nth-child is 1-based, so headerIndex 1 (2024A) maps to td:nth-child(2)
                     const cell = row.querySelector(`td:nth-child(${headerIndex + 1})`);
                     if (cell && cell.hasAttribute('data-value')) {
                         const newValue = String(targetScenarioAnnualData[key]);
                         const oldValue = cell.getAttribute('data-value');
                         if (newValue !== oldValue) {
                             cell.setAttribute('data-value', newValue);
                             cellsToUpdate.push(cell);
                         }
                     }
                 }
             }
         });

         try {
            calculateAndSetARRperHead();
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

         cellsToUpdate.forEach(cell => {
             try {
                animateCountUp(cell);
             } catch(e) {
                 console.error("Error animating cell:", cell, e);
             }
         });

         redrawCharts();
     };

    // --- Internal Initialization Function (Scoped) --- //
    const initialize = () => {
        storeScenario1AnnualValues();

        try {
             calculateAndSetARRperHead();
        } catch (e) {
             console.error("Error calculating initial ARR per Head:", e);
        }

        // Use scoped allCounters
        allCounters.forEach(cell => {
            try {
                animateCountUp(cell);
            } catch (e) {
                console.error("Error animating initial cell:", cell, e);
                if (cell) cell.textContent = 'Err';
            }
        });

        currentScenario = 1;
        redrawCharts(); // Draw initial charts

        // Start interval internally
        startInterval();
    };

    // --- Control Functions (Exposed) --- //
    const startInterval = () => {
        stopInterval(); // Clear any existing interval first
        console.log(`Starting financial model interval (${updateIntervalTime}ms) for container ${containerId}`);
        mainUpdateInterval = setInterval(updateDashboard, updateIntervalTime);
    };

    const stopInterval = () => {
        if (mainUpdateInterval) {
            console.log(`Clearing financial model interval for container ${containerId}`);
            clearInterval(mainUpdateInterval);
            mainUpdateInterval = null;
        }
    };

    const triggerRedraw = () => {
        console.log(`Triggering redraw for financial model in container ${containerId}`);
        redrawCharts();
    };

    // --- Initialization & Resize Handling (Scoped) --- //
    initialize(); // Call internal init function

    // Handle resize - Note: This uses a global listener. Consider if parent should handle resize.
    const handleResize = () => {
        clearTimeout(resizeTimer);
        stopInterval();
        resizeTimer = setTimeout(() => {
            console.log("Re-drawing financial model charts after resize.");
            redrawCharts(); // Only redraw charts, don't restart interval automatically
            // startInterval(); // Optionally restart interval after resize debounce
        }, 500);
    };
    window.addEventListener('resize', handleResize);

    // Return control object
    return {
        start: startInterval,
        stop: stopInterval,
        redraw: triggerRedraw,
        // Function to cleanup listeners when component is removed
        destroy: () => {
            console.log(`Destroying financial model instance for ${containerId}`);
            stopInterval();
            window.removeEventListener('resize', handleResize);
            // Clear any other potential listeners or timeouts if added later
        }
    };
}

// Example Usage (would be called from index.html or similar):
// let financialModelInstance = null;
// document.addEventListener('DOMContentLoaded', () => {
//    financialModelInstance = initializeFinancialModel('embedded-financial-model');
// });

// To stop:
// if (financialModelInstance) {
//    financialModelInstance.stop();
// }

// To destroy (e.g., when removing the element):
// if (financialModelInstance) {
//    financialModelInstance.destroy();
//    financialModelInstance = null;
// }