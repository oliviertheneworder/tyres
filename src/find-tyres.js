console.log("find-tyre.js");

$(document).ready(function () {
    let tyres = [];

    // Disable profile, rim, and submit button initially
    $('select[name="profile"], select[name="rim"], #find-tyres-form button[type="submit"]').prop("disabled", true);

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

    let $ratioSelect = $('select[name="ratio"]'),
        $profileSelect = $('select[name="profile"]'),
        $rimSelect = $('select[name="rim"]'),
        $submitButton = $('#find-tyres-form button[type="submit"]');

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

    // Find Tyres by Vehicle

    $("#by-vehicle, #by-size").click(function () {
        var isVehicle = $(this).is("#by-vehicle");
        $("#by-vehicle, #by-size").removeClass("active");
        $(this).addClass("active");
        $(".by-vehicle, .by-size").addClass("hide");
        $(isVehicle ? ".by-vehicle" : ".by-size").removeClass("hide");
    });

    // set the following select fields to disabled
    $('select[name="model"], select[name="year"], select[name="trim"], select[name="size"]').prop('disabled', true);

    // set vehicle makes to dropdown list
    $("#vehicle-make-list .w-dyn-item").each(function () {
        var make = $(this).find(".vehicle-make-name").text();
        var slug = $(this).find(".vehicle-make-slug").text();
        $('select[name="make"]').append(new Option(make, slug));
    });

    // // if #find-make changes, remove disabled from #find-year
    // $("#find-make").change(function () {
    //     $("#find-year").prop('disabled', false);
    // });

    // // set #find-year options from the year 2000 to the current year
    // var currentYear = new Date().getFullYear();
    // for (var i = currentYear; i >= 2000; i--) {
    //     $("#find-year").append(new Option(i, i));
    // }

}); // End of document.ready