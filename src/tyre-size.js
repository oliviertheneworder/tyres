console.log("Loaded tyre-size.js");

if (window.location.pathname.includes('/tyre-size/')) {

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

    // Count tyres and update #quote-all-button
    $('#quote-all-button').text('Quote ' + $('.result-item').length + ' Tyres');
}