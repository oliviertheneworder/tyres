console.log("tyre-size.js");

if (window.location.pathname.includes('/tyre-size/')) {

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

    // Count tyres and update #quote-all-button on page load
    const defaultText = 'Quote ' + $('.result-item').length + ' Tyres';
    $('#quote-all-button').text(defaultText);

    // Store selected tyres in an array for quoting purposes
    var msfidArray = [];

    const iconPlus = $('[data-msfid]').find('svg path').attr('d'); // plus icon
    const iconMinus = 'M191.87-434.5v-91h576.26v91H191.87Z'; // minus icon

    // Function to animate quote button text update
    function updateQuoteButtonText(text) {
        const $button = $('#quote-all-button');
        $button.text(text);
        gsap.timeline()
            .to($button, {
                scale: 1.2,
                duration: 0.15
            })
            .to($button, {
                scale: 1,
                duration: 0.15
            });
    }

    // data-msfid click without .added-to-quote, add to msfidArray
    $('[data-msfid]').on('click', function () {
        if (!$(this).hasClass('added-to-quote')) {
            msfidArray.push($(this).data('msfid'));
            $(this).parents('.w-dyn-item').children('.result-overlay').animate({opacity: 1}, 200);
            $(this).find('svg path').attr('d', iconMinus);
            $(this).find('.button-text').text('Remove');
            $(this).css('background-color', 'transparent');
            $(this).addClass('added-to-quote');
            $(this).css('border', '1px solid var(--white)');
            console.log('msfidArray: ' + msfidArray);
        } else {
            // remove from msfidArray
            msfidArray = msfidArray.filter(id => id !== $(this).data('msfid'));
            $(this).parents('.w-dyn-item').children('.result-overlay').animate({opacity: 0}, 200);
            $(this).find('svg path').attr('d', iconPlus);
            $(this).removeClass('added-to-quote');
            $(this).find('.button-text').text('Quote');
            $(this).css('background-color', 'var(--red)');
            $(this).css('border', 'none');
            console.log('msfidArray: ' + msfidArray);
        }

        // Update quote button text based on msfidArray length
        if (msfidArray.length > 0) {
            updateQuoteButtonText('Quote ' + msfidArray.length + ' Tyres');
        } else {
            updateQuoteButtonText(defaultText);
        }
    });

    // QUOTE BRANCH FUNCTIONALITY

    const branchItems = $('.branch-item');

    // Extract unique provinces
    const provinces = [];
    branchItems.each(function () {
        const province = $(this).find('.branch-province').text();
        if (!provinces.includes(province)) {
            provinces.push(province);
        }
    });

    // Sort provinces alphabetically
    provinces.sort();

    // Populate province dropdown
    const provinceSelect = $('#quote-province');
    provinces.forEach(function (province) {
        provinceSelect.append($('<option>', {
            value: province,
            text: province
        }));
    });

    // Disable branch dropdown initially
    const branchSelect = $('#quote-branch');
    branchSelect.prop('disabled', true);

    // When province is selected, populate branch dropdown
    provinceSelect.on('change', function () {
        const selectedProvince = $(this).val();

        // Clear previous options except the placeholder
        branchSelect.find('option:not(:first)').remove();

        if (selectedProvince) {
            // Find branches for selected province
            branchItems.each(function () {
                const branchProvince = $(this).find('.branch-province').text();
                const branchName = $(this).find('.branch-name').text();

                if (branchProvince === selectedProvince) {
                    branchSelect.append($('<option>', {
                        value: branchName,
                        text: branchName
                    }));
                }
            });

            // Enable branch dropdown
            branchSelect.prop('disabled', false);
        } else {
            // If no province is selected, disable branch dropdown
            branchSelect.prop('disabled', true);
        }
    });

    // if #quote-all-button is clicked and msfidArray is empty, then load all data-msfid values into msfidArray
    $('#quote-all-button').on('click', function () {
        if (msfidArray.length === 0) {
            $('[data-msfid]').each(function () {
                msfidArray.push($(this).data('msfid'));
            });
        }
        console.log('msfidArray: ' + msfidArray);
    });
    // if
}