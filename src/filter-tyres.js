console.log('filter-tyres.js');

// Add styles for disabled checkboxes
const style = document.createElement('style');
style.textContent = `
    .filter-container label.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .filter-container input[type="checkbox"]:disabled {
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

let $results = $(".result-item");

// Store available filter options dynamically
let brands = new Set();
let pricePositions = new Set();
let otherFeatures = new Set();
let suvTypes = new Set();
let speedRatings = new Set();
let loadRatings = new Set();

// Extract available options from the tyres
$results.each(function () {
    let brand = $(this).find(".brand-name-modal").first().text().trim();
    let pricePosition = $(this).find(".result-promo").first().text().trim();
    let speedIndex = $(this).find(".speed-index").first().text().trim();
    let loadRating = $(this).find(".load-rating").first().text().trim();
    let suv = $(this).find(".performance-row:contains('4X4')").first().text().trim();

    let runFlat = $(this).find(".key-features:contains('Run Flat')").length > 0 ? "Run Flat" : "";
    let lowStock = $(this).find(".low-stock:visible").length > 0 ? "Low Stock" : "";

    if (brand) brands.add(brand);
    if (pricePosition) pricePositions.add(pricePosition);
    if (speedIndex) speedRatings.add(speedIndex);
    if (loadRating) loadRatings.add(loadRating);
    if (suv) suvTypes.add(suv);
    if (runFlat) otherFeatures.add(runFlat);
    if (lowStock) otherFeatures.add(lowStock);
});

// Function to generate filter checkboxes dynamically
function generateFilterOptions(container, items) {
    let $container = $(`#${container}`);
    if (items.size > 0) {
        items.forEach(item => {
            $container.append(
                `<fieldset class="checkbox-field"><label class="checkbox-label"><input type="checkbox" class="filter-option" data-filter="${container}" value="${item}">&nbsp;&nbsp;${item}</label></fieldset>`
            );
        });
    } else {
        $container.closest(".filter-section").hide(); // Hide section if no values exist
    }
}

// Populate Filters
generateFilterOptions("brand-filter", brands);
generateFilterOptions("price-filter", pricePositions);
generateFilterOptions("speed-filter", speedRatings);
generateFilterOptions("load-filter", loadRatings);
generateFilterOptions("suv-filter", suvTypes);
generateFilterOptions("other-filter", otherFeatures);

// Function to update checkbox states based on available results
function updateCheckboxStates() {
    let activeFilters = {};

    // Get currently active filters
    $(".filter-option:checked").each(function () {
        let filterCategory = $(this).data("filter");
        let value = $(this).val();
        if (!activeFilters[filterCategory]) {
            activeFilters[filterCategory] = [];
        }
        activeFilters[filterCategory].push(value);
    });

    // Check each checkbox
    $(".filter-option").each(function () {
        let $checkbox = $(this);
        let filterCategory = $checkbox.data("filter");
        let value = $checkbox.val();

        // Temporarily check this checkbox
        let wasChecked = $checkbox.prop("checked");
        $checkbox.prop("checked", true);

        // Count visible results with this filter
        let visibleCount = 0;
        $results.each(function () {
            let $this = $(this);
            let matches = true;

            // Check all active filters plus the current one
            Object.keys(activeFilters).forEach(category => {
                let tyreValue = "";
                if (category === "other-filter") {
                    let isRunFlat = $this.find(".run-flat:visible").length > 0;
                    let isLowStock = $this.find(".low-stock:visible").length > 0;
                    tyreValue = isRunFlat ? "Run Flat" : isLowStock ? "Low Stock" : "";
                } else if (category === "brand-filter") {
                    // Special handling for brand names
                    tyreValue = $this.find(".brand-name-modal").text().trim();
                } else {
                    tyreValue = $this.find(`.${category.replace("-filter", "")}`).text().trim();
                }

                if (category === filterCategory) {
                    if (tyreValue !== value) matches = false;
                } else if (activeFilters[category].length > 0 && !activeFilters[category].includes(tyreValue)) {
                    matches = false;
                }
            });

            if (matches) visibleCount++;
        });

        // Restore checkbox state
        $checkbox.prop("checked", wasChecked);

        // Disable/enable checkbox based on results
        $checkbox.prop("disabled", visibleCount === 0);
        $checkbox.closest("label").toggleClass("disabled", visibleCount === 0);
    });
}

// Apply Filters
$(".filter-container input").on("change", function () {
    let activeFilters = {};

    $(".filter-option:checked").each(function () {
        let filterCategory = $(this).data("filter");
        let value = $(this).val();

        if (!activeFilters[filterCategory]) {
            activeFilters[filterCategory] = [];
        }
        activeFilters[filterCategory].push(value);
    });

    // Filtering Logic
    $results.each(function () {
        let $this = $(this);
        let matches = true;

        Object.keys(activeFilters).forEach(filterCategory => {
            let tyreValue = "";

            if (filterCategory === "other-filter") {
                // Handle special visibility filters for "Other"
                let isRunFlat = $this.find(".run-flat:visible").length > 0;
                let isLowStock = $this.find(".low-stock:visible").length > 0;
                tyreValue = isRunFlat ? "Run Flat" : isLowStock ? "Low Stock" : "";
            } else if (filterCategory === "brand-filter") {
                // Special handling for brand names
                tyreValue = $this.find(".brand-name-modal").text().trim();
            } else {
                tyreValue = $this.find(`.${filterCategory.replace("-filter", "")}`).text().trim();
            }

            if (activeFilters[filterCategory].length > 0 && !activeFilters[filterCategory].includes(tyreValue)) {
                matches = false;
            }
        });

        $this.toggle(matches);
    });

    // Update checkbox states after filtering
    updateCheckboxStates();
});

// Initial checkbox state update
updateCheckboxStates();