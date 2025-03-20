console.log('filter-tyres.js');

$(document).ready(function () {
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
        let brand = $(this).find(".result-name-wrap .result-brand-name").text().trim();
        let pricePosition = $(this).find(".price-position").text().trim();
        let speedIndex = $(this).find(".speed-index").text().trim();
        let loadRating = $(this).find(".load-rating").text().trim();
        let suv = $(this).find(".suv-type").text().trim();

        let runFlat = $(this).find(".run-flat:visible").length > 0 ? "Run Flat" : "";
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
                    `<label><input type="checkbox" class="filter-option" data-filter="${container}" value="${item}"> ${item}</label>`
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

    // Apply Filters
    $("#apply-filters").on("click", function () {
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
                } else {
                    tyreValue = $this.find(`.${filterCategory.replace("-filter", "")}`).text().trim();
                }

                if (activeFilters[filterCategory].length > 0 && !activeFilters[filterCategory].includes(tyreValue)) {
                    matches = false;
                }
            });

            $this.toggle(matches);
        });
    });
});