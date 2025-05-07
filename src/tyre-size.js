console.log("tyre-size.js");

// Constants
const ICONS = {
    PLUS: $('[data-msfid]').find('svg path').attr('d'),
    MINUS: 'M191.87-434.5v-91h576.26v91H191.87Z'
};

const SELECTORS = {
    QUOTE_BUTTON: '#quote-all-button',
    QUOTE_MSFID_INPUT: 'input[name="quote_msfid"]',
    QUOTE_TYRE_DATA: 'input[name="quote_tyre_data"]',
    QUOTE_RAW_SEARCH: 'input[name="quote_raw_search"]',
    QUOTE_EXT_REF: 'input[name="quote_ext_ref"]',
    QUOTE_PROVINCE: 'select[name="quote_province"]',
    QUOTE_BRANCH: 'select[name="quote_branch"]',
    QUOTE_BRANCH_ID: 'input[name="quote_branch_id"]',
    RESULT_ITEM: '.result-item',
    BRANCH_ITEM: '.branch-item'
};

// Utility Functions
const generateTimestamp = () => {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const updateQuoteButtonText = (text) => {
    const $button = $(SELECTORS.QUOTE_BUTTON);
    $button.text(text);
    gsap.timeline()
        .to($button, { scale: 1.2, duration: 0.15 })
        .to($button, { scale: 1, duration: 0.15 });
};

const getTyreDetails = ($element) => {
    try {
        const msfid = $element.data('msfid');
        if (!msfid) throw new Error('MSFID not found');
        
        const promos = [];
        $element.closest(SELECTORS.RESULT_ITEM).find('.promo-item').each(function() {
            const $promo = $(this);
            const promoText = $promo.find('.promo-item-txt').text().trim();
            const promoValue = $promo.find('.promo-item-val').text().trim();
            
            promos.push({
                text: promoText,
                value: promoValue === 'true' ? true : promoValue === 'false' ? false : promoValue
            });
        });

        return { msfid, promos };
    } catch (error) {
        console.error('Error getting tyre details:', error);
        return null;
    }
};

// Main initialization
if (window.location.pathname.includes('/tyre-size/')) {
    let allMsfidsAdded = false;
    let msfidArray = [];
    const defaultText = `Quote ${$(SELECTORS.RESULT_ITEM).length} Tyres`;

    // Initialize star ratings
    $('.stars').each(function() {
        const $starsContainer = $(this);
        const $starCountElement = $starsContainer.find('.star-count');
        const count = parseInt($starCountElement.text(), 10) - 1;
        
        if (!isNaN(count) && count > 0) {
            const $referenceStar = $starsContainer.find('.star').first();
            if ($referenceStar.length) {
                for (let i = 0; i < count; i++) {
                    $starsContainer.append($referenceStar.clone());
                }
            }
        }
    });

    // Convert tyre size from h1 to input format
    const $h1TyreSize = $('h1').text().trim();
    if ($h1TyreSize) {
        const tyreSizeMatch = $h1TyreSize.match(/(\d+)\/(\d+)R(\d+)/);
        if (tyreSizeMatch) {
            const [, width, aspectRatio, diameter] = tyreSizeMatch;
            $(SELECTORS.QUOTE_RAW_SEARCH).val(`${width}${aspectRatio}${diameter}`);
        }
    }

    // Set reference ID
    const referenceId = `TNO-${generateTimestamp()}`;
    $(SELECTORS.QUOTE_EXT_REF).val(referenceId);

    // Initialize quote button text
    updateQuoteButtonText(defaultText);

    // Handle tyre selection
    $('[data-msfid]').on('click', function() {
        const $this = $(this);
        
        if (allMsfidsAdded) {
            msfidArray = [];
            allMsfidsAdded = false;
        }

        if (!$this.hasClass('added-to-quote')) {
            const tyreDetails = getTyreDetails($this);
            if (tyreDetails) {
                msfidArray.push(tyreDetails);
                $this.parents('.w-dyn-item').children('.result-overlay').animate({ opacity: 1 }, 200);
                $this.find('svg path').attr('d', ICONS.MINUS)
                    .end()
                    .find('.button-text').text('Remove')
                    .end()
                    .css({
                        'background-color': 'transparent',
                        'border': '1px solid var(--white)'
                    })
                    .addClass('added-to-quote');
            }
        } else {
            const msfid = $this.data('msfid');
            msfidArray = msfidArray.filter(item => item.msfid !== msfid);
            $this.parents('.w-dyn-item').children('.result-overlay').animate({ opacity: 0 }, 200);
            $this.find('svg path').attr('d', ICONS.PLUS)
                .end()
                .removeClass('added-to-quote')
                .find('.button-text').text('Quote')
                .end()
                .css({
                    'background-color': 'var(--red)',
                    'border': 'none'
                });
        }

        // Update quote_msfid input with full array of objects
        $(SELECTORS.QUOTE_MSFID_INPUT).val(JSON.stringify(msfidArray));
        
        // Update quote button text
        updateQuoteButtonText(msfidArray.length > 0 ? `Quote ${msfidArray.length} Tyres` : defaultText);
    });

    // Branch functionality
    const $branchItems = $(SELECTORS.BRANCH_ITEM);
    const $provinceSelect = $(SELECTORS.QUOTE_PROVINCE);
    const $branchSelect = $(SELECTORS.QUOTE_BRANCH);
    const $branchSelectId = $(SELECTORS.QUOTE_BRANCH_ID);

    // Initialize provinces
    const provinces = [...new Set($branchItems.map(function() {
        return $(this).find('.branch-province').text();
    }).get())].sort();

    provinces.forEach(province => {
        $provinceSelect.append($('<option>', { value: province, text: province }));
    });

    $branchSelect.prop('disabled', true);

    // Handle province selection
    $provinceSelect.on('change', function() {
        const selectedProvince = $(this).val();
        $branchSelect.find('option:not(:first)').remove();

        if (selectedProvince) {
            $branchItems.each(function() {
                const $item = $(this);
                const branchProvince = $item.find('.branch-province').text();
                
                if (branchProvince === selectedProvince) {
                    const branchName = $item.find('.branch-name').text();
                    const branchId = $item.find('.branch-id').text();
                    
                    $branchSelect.append($('<option>', {
                        value: branchId,
                        text: branchName
                    }));
                }
            });
            $branchSelect.prop('disabled', false);
        } else {
            $branchSelect.prop('disabled', true);
        }
    });

    // Handle branch selection
    $branchSelect.on('change', function() {
        const selectedBranchId = $(this).val();
        $branchSelectId.val(selectedBranchId);
    });

    // Handle quote all button
    $(SELECTORS.QUOTE_BUTTON).on('click', function() {
        if (msfidArray.length === 0) {
            $('[data-msfid]').each(function() {
                const tyreDetails = getTyreDetails($(this));
                if (tyreDetails) {
                    msfidArray.push(tyreDetails);
                }
            });
            
            allMsfidsAdded = true;
            $(SELECTORS.QUOTE_MSFID_INPUT).val(JSON.stringify(msfidArray));
        }
    });
}