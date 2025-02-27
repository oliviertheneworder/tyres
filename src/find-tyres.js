console.log("Loaded find-tyres.js");

$(document).ready(function () {
    let tyres = [];

    // Disable profile, rim, and submit button initially
    $("#find-profile, #find-rim, #find-tyres-form button[type='submit']").prop("disabled", true);

    // Extract CMS data
    $("#size-data .w-dyn-item").each(function () {
        let ratio = $(this).find(".size-width").text().trim();
        let profile = $(this).find(".size-profile").text().trim();
        let rim = $(this).find(".size-rim").text().trim();

        if (ratio && profile && rim) {
            tyres.push({ ratio, profile, rim });
        }
    });

    // Get unique values
    let uniqueRatios = [...new Set(tyres.map(t => t.ratio))].sort((a, b) => a - b);

    let $ratioSelect = $("#find-ratio"),
        $profileSelect = $("#find-profile"),
        $rimSelect = $("#find-rim"),
        $submitButton = $("#find-tyres-form button[type='submit']");

    // Populate Ratio dropdown
    uniqueRatios.forEach(ratio => {
        $ratioSelect.append(new Option(ratio, ratio));
    });

    // Handle Ratio selection
    $ratioSelect.on("change", function () {
        let selectedRatio = $(this).val();

        $profileSelect.html('<option value="">…</option>').prop("disabled", true);
        $rimSelect.html('<option value="">…</option>').prop("disabled", true);
        $submitButton.prop("disabled", true);

        if (!selectedRatio) return;

        let filteredProfiles = [...new Set(tyres.filter(t => t.ratio === selectedRatio).map(t => t.profile))].sort((a, b) => a - b);

        filteredProfiles.forEach(profile => {
            $profileSelect.append(new Option(profile, profile));
        });

        $profileSelect.prop("disabled", false);
        localStorage.setItem("selectedTyreRatio", selectedRatio);
    });

    // Handle Profile selection
    $profileSelect.on("change", function () {
        let selectedRatio = $ratioSelect.val();
        let selectedProfile = $(this).val();

        $rimSelect.html('<option value="">…</option>').prop("disabled", true);
        $submitButton.prop("disabled", true);

        if (!selectedProfile) return;

        let filteredRims = [...new Set(tyres.filter(t => t.ratio === selectedRatio && t.profile === selectedProfile).map(t => t.rim))].sort();

        filteredRims.forEach(rim => {
            $rimSelect.append(new Option(rim, rim));
        });

        $rimSelect.prop("disabled", false);
        localStorage.setItem("selectedTyreProfile", selectedProfile);
    });

    // Enable Submit Button when Rim is selected
    $rimSelect.on("change", function () {
        $submitButton.prop("disabled", !$(this).val());
        localStorage.setItem("selectedTyreRim", $(this).val());
    });

    // Form Submission (Redirect to results page)
    $("#find-tyres-form").on("submit", function (event) {
        event.preventDefault();

        let ratio = $ratioSelect.val();
        let profile = $profileSelect.val().replace(".", "-");
        let rim = $rimSelect.val().toLowerCase();

        if (ratio && profile && rim) {
            localStorage.setItem("selectedTyreSize", `${ratio}-${profile}-${rim}`);
            window.location.href = `/tyre-size/${ratio}-${profile}-${rim}`;
        } else {
            alert("Please select all fields.");
        }
    });

    // Load saved selections from localStorage (in sequence)
    let savedRatio = localStorage.getItem("selectedTyreRatio");
    if (savedRatio) {
        $ratioSelect.val(savedRatio).trigger("change");

        setTimeout(() => {
            let savedProfile = localStorage.getItem("selectedTyreProfile");
            if (savedProfile) {
                $profileSelect.val(savedProfile).trigger("change");

                setTimeout(() => {
                    let savedRim = localStorage.getItem("selectedTyreRim");
                    if (savedRim) {
                        $rimSelect.val(savedRim).trigger("change");
                    }
                }, 300);
            }
        }, 300);
    }
}); // End of document.ready