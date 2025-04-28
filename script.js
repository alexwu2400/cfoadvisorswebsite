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
    const scenarios = {
        scenario1: {}, // Will store the initial HTML values
        scenario2: { // Updated Scenario 2 data (2025E-2028E)
            // Format: metricName_Year: value (raw value, matching HTML data-value expectations)
            // NOTE: 2024A data is ignored here as only 2025E-2028E are updated by scenario switch

            // 2025E
            "BeginningARR_2025E": 0.80,
            "NewARR_2025E": 1.76,
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
            "TotalOperatingExp_2025E": 3.94,
            "NetIncome_2025E": -2.677,
            "EndingCash_2025E": -1.262,
            "AvgMonthlyBurn_2025E": (223083 / 1000000).toFixed(6), // Convert dollars to millions string
            "TotalHeadcount_2025E": 36,
            "ARRperHead_2025E": 0.063,

            // 2026E
            "BeginningARR_2026E": 2.28,
            "NewARR_2026E": 3.57,
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
            "EndingCash_2026E": -6.332, // Adjusted value from S2 JSON
            "AvgMonthlyBurn_2026E": (422083 / 1000000).toFixed(6), // Convert dollars to millions string
            "TotalHeadcount_2026E": 70,
            "ARRperHead_2026E": 0.089,

            // 2027E
            "BeginningARR_2027E": 6.20,
            "NewARR_2027E": 5.30,
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
            "TotalOperatingExp_2027E": 9.38,
            "NetIncome_2027E": -2.516,
            "EndingCash_2027E": -8.848, // Adjusted value from S2 JSON
            "AvgMonthlyBurn_2027E": (209667 / 1000000).toFixed(6), // Convert dollars to millions string
            "TotalHeadcount_2027E": 100,
            "ARRperHead_2027E": 0.114,

            // 2028E
            "BeginningARR_2028E": 11.40,
            "NewARR_2028E": 7.24,
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
            "TotalOperatingExp_2028E": 13.89,
            "NetIncome_2028E": -1.566,
            "EndingCash_2028E": -10.414, // Adjusted value from S2 JSON
            "AvgMonthlyBurn_2028E": (130500 / 1000000).toFixed(6), // Convert dollars to millions string
            "TotalHeadcount_2028E": 140,
            "ARRperHead_2028E": 0.144,
        }
    };

     // --- Store Initial HTML (Scenario 1) Values --- //
    const storeScenario1Values = () => {
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
                     scenarios.scenario1[key] = value;
                 }
             });
          });
     };

    // --- Formatting Function (Handles Units, Expects BASE Value) --- //
    const formatNumber = (value, unit) => {
        // Handle specific string values first
        if (typeof value === 'string' && value.toLowerCase() === 'profitable') {
            return 'Profitable';
        }

        const numericValue = parseFloat(value);

        // Handle null/NaN or 'null' string
        if (isNaN(numericValue) || value === null || value === 'null') {
            return '–';
        }

        let formattedValue;
        let addParensForNegative = false;

        switch (unit) {
            case '$ MM':
                // Format as millions with ONE decimal place
                formattedValue = Math.abs(numericValue / 1000000).toFixed(1) + 'M';
                addParensForNegative = true;
                break;
            case '$ MM/month':
                 // Format as dollars with commas (no forced rounding)
                 formattedValue = numericValue.toLocaleString(undefined, { 
                     minimumFractionDigits: 0, // Show decimals only if needed
                     maximumFractionDigits: 0  // Show only whole dollars
                 });
                 addParensForNegative = true; // Still use parens for negative burn
                 break;
            case '$ K':
                 // Format as thousands with ONE decimal place
                formattedValue = Math.abs(numericValue / 1000).toFixed(1) + 'K';
                addParensForNegative = true;
                break;
            case '%':
                // Format percentage with ZERO decimal places
                formattedValue = Math.round(numericValue).toFixed(0) + '%';
                break;
            case 'count':
            case 'FTE':
                formattedValue = Math.round(numericValue).toLocaleString(undefined, { maximumFractionDigits: 0 });
                break;
            case '$': // For ARR per Head & Avg Monthly Burn (formatted as dollars)
                 formattedValue = Math.round(numericValue).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                 });
                 addParensForNegative = true; // Use parens for negative dollar amounts
                 break;
            default:
                formattedValue = numericValue.toLocaleString();
                break;
        }

        if (numericValue < 0 && addParensForNegative) {
            return `(${formattedValue})`;
        }

        return formattedValue;
    };

    // --- Helper to Parse Formatted Numbers back to BASE Raw Numeric --- //
    const parseFormattedNumber = (formattedString) => {
        if (typeof formattedString !== 'string') return NaN;
        let cleanString = formattedString.trim();

        // Handle special display strings
        if (cleanString === '–' || cleanString === 'N/A' || cleanString.toLowerCase() === 'profitable') {
            return NaN; // Cannot animate these
        }

        let multiplier = 1;
        let isNegative = false;

        // Handle parentheses for negative
        if (cleanString.startsWith('(') && cleanString.endsWith(')')) {
            isNegative = true;
            cleanString = cleanString.substring(1, cleanString.length - 1);
        }

        // Handle dollar sign prefix if present
         if (cleanString.startsWith('$')) {
            cleanString = cleanString.substring(1).trim();
         }

        // Handle suffixes FIRST to determine multiplier/type
         if (cleanString.endsWith('/mo')) {
             cleanString = cleanString.replace('/mo', '').trim();
             multiplier = 1000000;
        }
         else if (cleanString.endsWith('%')) {
            cleanString = cleanString.substring(0, cleanString.length - 1);
            multiplier = 1;
        }
        else if (cleanString.endsWith('K')) {
             multiplier = 1000;
            cleanString = cleanString.substring(0, cleanString.length - 1);
        }
        else if (cleanString.endsWith('M')) {
            multiplier = 1000000;
            cleanString = cleanString.substring(0, cleanString.length - 1);
        }
        // If no suffix, check for commas (likely count, FTE, or direct dollars)
        else if (cleanString.includes(',')) {
            multiplier = 1; // Direct value
        }
        // If no suffix and no commas, assume direct value (could be small decimal)
        else {
             multiplier = 1;
        }

        // Remove commas AFTER suffix handling
        cleanString = cleanString.replace(/,/g, '');

        let value = parseFloat(cleanString);

        if (isNaN(value)) return NaN;

        // Apply multiplier to get the base value
        value *= multiplier;

        if (isNegative) {
            value = -value;
        }
        return value;
    };

    // --- Calculate ARR per Head (for the currently displayed data) --- //
    const calculateAndSetARRperHead = () => {
        const endingArrRow = findRowByMetric('EndingARR');
        const headcountRow = findRowByMetric('TotalHeadcount');
        const arrPerHeadRow = findRowByMetric('ARRperHead');

        if (!endingArrRow || !headcountRow || !arrPerHeadRow) {
            return;
        }

        const arrCells = endingArrRow.querySelectorAll('td[data-value]');
        const headcountCells = headcountRow.querySelectorAll('td[data-value]');
        const arrPerHeadCells = arrPerHeadRow.querySelectorAll('td[data-value]');

        if (arrCells.length !== 5 || headcountCells.length !== 5 || arrPerHeadCells.length !== 5) {
             return;
        }

        for (let i = 0; i < 5; i++) {
            // Read current values from the table cells' data-value attributes
            const endingArrMillions = parseFloat(arrCells[i].getAttribute('data-value'));
            const totalHeadcount = parseFloat(headcountCells[i].getAttribute('data-value'));

            let calculatedArrPerHead = NaN; // Default to NaN
            if (!isNaN(endingArrMillions) && !isNaN(totalHeadcount) && totalHeadcount !== 0) {
                // ARR is in Millions in data-value, Headcount is direct
                 calculatedArrPerHead = (endingArrMillions * 1000000) / totalHeadcount;
            }

            // Update the data-value attribute - store the *raw calculated value* (dollars)
            // Handle potential NaN result by storing 'null' string
            const newValue = isNaN(calculatedArrPerHead) ? 'null' : calculatedArrPerHead.toFixed(0); // Store as string
            arrPerHeadCells[i].setAttribute('data-value', newValue);
        }
    };

    // --- Number Animation Function (Uses Unit, Animates BASE Values) --- //
    const animateCountUp = (el) => {
        if (!el) return;
        const parentRow = el.closest('tr');
        if (!parentRow) return;

        let dataValueStr = el.getAttribute('data-value'); // e.g., "1.00", "10.0", "100", "null", "Profitable"
        const unit = parentRow.getAttribute('data-unit') || '';

        // Handle non-numeric target strings DIRECTLY (no animation)
        if (dataValueStr === 'null' || dataValueStr === null || dataValueStr === undefined || dataValueStr.toLowerCase() === 'profitable') {
            el.textContent = formatNumber(dataValueStr, unit); // Use formatNumber to handle 'Profitable' or '–' display
            return;
        }

        // Target value calculation (BASE numeric value)
        let targetNumericValue = parseFloat(dataValueStr);

        // Scale up based on unit if needed
        if (unit === '$ MM' || unit === '$ MM/month') { 
             targetNumericValue *= 1000000;
        } else if (unit === '$ K') {
             targetNumericValue *= 1000;
        } 

        // Handle Non-numeric target values after parse/scale attempt
        if (isNaN(targetNumericValue)) {
            el.textContent = '–';
            return;
        }

        // --- Animation Logic ---
        let startTimestamp = null;

        // --- Determine Start Value from Current Display (BASE numeric value) --- 
        const currentText = el.textContent;
        let startValue = parseFormattedNumber(currentText); // Returns base value or NaN
        if (isNaN(startValue)) {
             startValue = 0; // Default start from 0 if current text not parseable
        }

        const endValue = targetNumericValue; // Target is already base value

        // Don't animate if start and end are effectively the same
        if (Math.abs(startValue - endValue) < 0.01) { 
            el.textContent = formatNumber(endValue, unit); // Format the BASE end value
            return;
        }

        // Set initial text to formatted start value
        try {
             el.textContent = formatNumber(startValue, unit); // Format the BASE start value
        } catch(e) {
             el.textContent = "Err";
        }

        const step = (timestamp) => {
            try {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / numberAnimationDuration, 1);
                // Animate between the base numeric start and end values
                let currentAnimatedBaseVal = progress * (endValue - startValue) + startValue;

                // Format the current animated BASE value using the unit
                el.textContent = formatNumber(currentAnimatedBaseVal, unit);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                    // Ensure final value is exact and formatted correctly on completion
                    // Format the TARGET base value for final display
                    el.textContent = formatNumber(targetNumericValue, unit);
                }
            } catch(e) {
                 try { el.textContent = formatNumber(endValue, unit); } catch {} 
            }
        };
        window.requestAnimationFrame(step);
    };

    // --- Quarterly Data Generation ---
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

    const interpolateQuarterly = (annualData) => {
        const quarterly = [];
        if (!annualData || annualData.length !== totalYears) return quarterly; // Expecting 5 years of data

        // Handle beginning ARR special case - it should align with previous year's ending ARR
        // We'll calculate ending ARR first, then derive beginning ARR.

        let lastEndingArr = 0; // Assume starts at 0 before 2024A
        for (let year = 0; year < totalYears; year++) {
            const yearEndingArr = annualData[year]; // Get the ending ARR for the year
            const yearBeginningArr = lastEndingArr;
            const totalGrowthThisYear = yearEndingArr - yearBeginningArr;
            const quarterlyGrowth = totalGrowthThisYear / quartersPerYear;

            for (let quarter = 1; quarter <= quartersPerYear; quarter++) {
                const quarterEndingArr = yearBeginningArr + quarterlyGrowth * quarter;
                quarterly.push(quarterEndingArr);
            }
            lastEndingArr = yearEndingArr;
        }
        return quarterly;
    };

     const generateQuarterlyArrData = () => {
        const endingArrRow = findRowByMetric('EndingARR');
        if (!endingArrRow) {
            return { labels: [], values: [] };
        }

        const arrCells = endingArrRow.querySelectorAll('td[data-value]');

        const annualEndingArrValues = Array.from(arrCells).map((td, index) => {
             const rawValue = td.getAttribute('data-value');
             const val = parseFloat(rawValue);
             return isNaN(val) ? 0 : val * 1000000;
        });

        const quarterlyLabels = generateQuarterlyLabels();
        const quarterlyValues = interpolateQuarterly(annualEndingArrValues);

        return { labels: quarterlyLabels, values: quarterlyValues };
    };

    const generateQuarterlyCashflowData = (quarterlyLabels) => {
        // Generate quarterly cashflow: unprofitable until Q2 2027, then profitable
        const values = [];
        const unprofitableQuarters = 3 * quartersPerYear + 2; // Target end of unprofitability = index 14 (Q2 27E)
        const transitionQuarters = 2; // Quarters before/after target for smoothing
        const smoothStartQuarter = unprofitableQuarters - transitionQuarters; // Index 12 (Q4 26E)
        const smoothEndQuarter = unprofitableQuarters + transitionQuarters; // Index 16 (Q4 27E)

        let currentCashflow = -200000; // Start slightly negative
        const peakNegative = -1000000; // Deepest point
        const targetPositiveSteady = 1500000; // Target for later quarters
        const initialNegativeTrend = (peakNegative - currentCashflow) / (smoothStartQuarter * 0.7); // Trend towards peak negative

        for (let i = 0; i < totalQuarters; i++) {
            if (i < smoothStartQuarter) {
                // Phase 1: Trend towards peak negative cashflow
                currentCashflow += initialNegativeTrend * (1 + (Math.random() - 0.5) * 0.2);
                currentCashflow = Math.max(currentCashflow, peakNegative); // Clamp at peak negative

            } else if (i >= smoothStartQuarter && i <= smoothEndQuarter) {
                 // Phase 2: Smooth transition from negative towards positive
                 const transitionProgress = (i - smoothStartQuarter) / (smoothEndQuarter - smoothStartQuarter);
                 // Use an easing function (e.g., easeInOutQuad) for a smoother curve through zero
                 const easedProgress = transitionProgress < 0.5
                     ? 2 * transitionProgress * transitionProgress
                     : 1 - Math.pow(-2 * transitionProgress + 2, 2) / 2;

                 // Interpolate between the cashflow value at the start of the transition and a slightly positive target
                 const startTransitionValue = values[smoothStartQuarter -1] || peakNegative; // Get value before smoothing started
                 const targetTransitionValue = 50000; // Aim slightly positive just after transition
                 currentCashflow = startTransitionValue + (targetTransitionValue - startTransitionValue) * easedProgress;
                 // Add some minor variation
                 currentCashflow += (Math.random() - 0.5) * 100000 * (1-Math.abs(easedProgress - 0.5)*2); // Less variation near zero

            } else {
                // Phase 3: Gradual growth towards steady positive cashflow
                if (i === smoothEndQuarter + 1) {
                    // Ensure starting value for this phase is based on the end of the transition
                    currentCashflow = values[i-1] || 50000;
                }
                const growthFactor = 1.15 + Math.random() * 0.1; // Increased base growth factor (e.g., 15-25% per quarter)
                currentCashflow *= growthFactor;
                // Increase the cap significantly to allow for more growth
                currentCashflow = Math.min(currentCashflow, targetPositiveSteady * 2.5); // Allow growth up to 2.5x the original steady target
                // Ensure it stays positive
                currentCashflow = Math.max(currentCashflow, 10000);
            }
            values.push(Math.round(currentCashflow));
        }

        return {
            labels: quarterlyLabels,
            values: values
        };
    };

    // --- Bar Chart Creation Function (Handles Quarterly Data) --- //
    const createChartBars = (data, container, labelsContainer, isCashflow = false) => {
        if (!container || !labelsContainer || !data || data.values.length === 0 || data.values.length !== data.labels.length) {
             return;
        }
        container.innerHTML = ''; // Clear existing bars
        labelsContainer.innerHTML = ''; // Clear existing labels

        const fragment = document.createDocumentFragment();
        const labelFragment = document.createDocumentFragment();

        const values = data.values;
        const labels = data.labels;
        const barCount = values.length;

        // Determine scale
        const allValues = values.map(v => v || 0); // Handle potential null/undefined
        let maxVal = 0;
        let minVal = 0;
        if (isCashflow) {
            maxVal = Math.max(0, ...allValues);
            minVal = Math.min(0, ...allValues);
        } else {
            maxVal = Math.max(...allValues);
            minVal = 0; // ARR doesn't go below zero
        }

        // Add padding to scale
        const paddingFactor = 0.1; // 10% padding
        const range = maxVal - minVal;
        maxVal = maxVal + range * paddingFactor;
        if (isCashflow) {
             minVal = minVal - range * paddingFactor;
        } else {
             maxVal = Math.max(maxVal, 1000000); // Ensure ARR scale minimum
        }
        // Prevent zero range
         if (maxVal === minVal) {
             maxVal += 100000; // Add arbitrary range if all values are the same
             if (isCashflow && minVal !== 0) minVal -= 100000;
         }

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        if (containerWidth <= 0 || containerHeight <= 0) { return; }

        const barSpacing = containerWidth / barCount;
        const barWidth = Math.max(2, barSpacing * 0.6); // Narrower bars for quarterly view (60% width)
        const barGap = barSpacing - barWidth;

        const zeroLinePercent = isCashflow ? (maxVal / (maxVal - minVal)) * 100 : 0;

        values.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            const itemValue = value || 0;

            let heightPercentage = 0;
            let bottomPositionPercent = 0;
            let topPositionPercent = null; // Use null to unset

            if (isCashflow) {
                const totalRange = maxVal - minVal;
                 heightPercentage = totalRange === 0 ? 0 : (Math.abs(itemValue) / totalRange) * 100;

                if (itemValue >= 0) {
                    bar.classList.add('positive');
                    // Starts at zero line, goes up
                    bottomPositionPercent = zeroLinePercent;
                    // bar.style.top will be unset
                } else {
                    bar.classList.add('negative');
                    // Ends at zero line, goes down (so top is set)
                     topPositionPercent = (100 - zeroLinePercent);
                    // bar.style.bottom will be unset
                 }
                 // Color based on profitability rule
                const unprofitableQuarters = 3 * quartersPerYear + 2; // 14
                if (index < unprofitableQuarters) {
                     bar.style.backgroundColor = 'var(--excel-negative-red)'; // Red before Q3 2027
                     bar.classList.remove('positive'); // Ensure classes match color if needed
                     bar.classList.add('negative');
                 } else {
                     bar.style.backgroundColor = 'var(--excel-positive-green)'; // Green from Q3 2027
                     bar.classList.remove('negative');
                     bar.classList.add('positive');
                 }

            } else { // ARR Chart
                const totalRange = maxVal - minVal; // minVal is 0 for ARR
                 heightPercentage = totalRange === 0 ? 0 : (itemValue / totalRange) * 100;
                bottomPositionPercent = 0; // Always starts from bottom
                bar.style.backgroundColor = 'var(--excel-chart-blue)'; // Use standard blue
             }

            // Apply styles
            bar.style.position = 'absolute';
            bar.style.left = `${index * barSpacing + barGap / 2}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.height = `0%`; // Start height at 0 for animation

            // Set bottom or top based on cashflow type
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

    // --- Redraw Charts based on current table data --- //
    const redrawCharts = () => {
         try {
             const arrData = generateQuarterlyArrData();
             const cashflowData = generateQuarterlyCashflowData(arrData.labels);

              // === Log Generated Chart Data ===
              console.log("Chart Data Generated:", {
                  arrValues: arrData.values.slice(0, 5).concat(arrData.values.slice(-5)), // Log first 5 and last 5
                  cashflowValues: cashflowData.values.slice(0, 5).concat(cashflowData.values.slice(-5)) // Log first 5 and last 5
              });
              // ================================

             createChartBars(arrData, arrChartContainer, arrLabelsContainer, false);
             createChartBars(cashflowData, cashflowChartContainer, cashflowLabelsContainer, true);
         } catch(e) {
         }
    }

    // --- Dashboard Update Function (Scenario Switching) --- //
    const updateDashboard = () => {
         currentScenario = currentScenario === 1 ? 2 : 1;
         const targetScenarioData = scenarios[`scenario${currentScenario}`];
         const cellsToUpdate = []; // Keep track of cells whose values change

         if (!tableBody) { return; }

         // Iterate over scenario 2 data and update table cells' data-value
         // NOTE: Scenario 2 only has a subset of keys
         Object.keys(targetScenarioData).forEach(key => {
             const [metricName, year] = key.split('_');
             if (!metricName || !year) return;

             const row = findRowByMetric(metricName); // Find row using data-metric
             if (row) {
                 const headerIndex = yearIndices[year];
                 if (headerIndex !== undefined && headerIndex > 0) { // Ensure valid year index > 0
                     const cell = row.querySelector(`td:nth-child(${headerIndex + 1})`);
                     if (cell && cell.hasAttribute('data-value')) {
                         const newValue = String(targetScenarioData[key]); // Ensure it's a string
                         const oldValue = cell.getAttribute('data-value');
                         if (newValue !== oldValue) {
                             cell.setAttribute('data-value', newValue);
                             cellsToUpdate.push(cell); // Add to list for re-animation/update
                         }
                     }
                 }
             }
         });

         // Recalculate ARR per Head for the new scenario data
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
         }

         // Apply updates/animations to only the changed cells
         cellsToUpdate.forEach(cell => {
             try {
                animateCountUp(cell);
             } catch(e) {
             }
         });

         redrawCharts();
     };

    // --- Initial Draw Function --- //
    const initializeDashboard = () => {
        storeScenario1Values();

        try {
             calculateAndSetARRperHead();
        } catch (e) {
        }

        // 3. Apply initial formatting/animation to all table cells
        document.querySelectorAll('.financial-summary td[data-value]').forEach(cell => {
            try {
                animateCountUp(cell);
            } catch (e) {
                if (cell) cell.textContent = 'Err';
            }
        });

        // 4. Draw initial charts based on Scenario 1 data
        redrawCharts();

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
            clearInterval(mainUpdateInterval);
        }
        resizeTimer = setTimeout(() => {
            initializeDashboard();
        }, 500);
    });
});