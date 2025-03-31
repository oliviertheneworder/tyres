console.log("tyre-size.js");

if (window.location.pathname.includes('/tyre-size/')) {

    let allMsfidsAdded = false;

    // PAGE LAYOUT

    // Set star ratings
    $('.stars').each(function () {
        var starsContainer = $(this);
        var starCountElement = starsContainer.find('.star-count');
        var count = parseInt(starCountElement.text(), 10);
        count = count - 1;
        if (!isNaN(count)) {
            var referenceStar = starsContainer.find('.star').first();

            if (referenceStar.length) {
                for (var i = 0; i < count; i++) {
                    starsContainer.append(referenceStar.clone());
                }
            }
        }
    });

    // QUOTE FUNCTIONALITY

    // Count tyres and update #quote-all-button o