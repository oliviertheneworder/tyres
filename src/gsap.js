console.log('gsap.js');

// Import GSAP and ScrollTrigger from the installed package
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Make GSAP available globally
window.gsap = gsap;

// Logo Ticker
const ticker = document.querySelector("#ticker");
if (ticker) {
    const tickerItems = [...ticker.children];

    // Duplicate content for seamless scrolling
    tickerItems.forEach(item => {
        let clone = item.cloneNode(true);
        ticker.appendChild(clone);
    });

    // Get the updated width after duplication
    const tickerWidth = ticker.scrollWidth;

    gsap.to(ticker, {
        x: `-${tickerWidth / 2}px`,
        duration: 25, // Adjust speed
        ease: "linear",
        repeat: -1
    });
}

// Modal Functionality

// set modal default scale to 0
gsap.set(".modal .modal-content", {
    scale: 0.9
});

$(".modal-trigger").on("click", function () {
    var $modal = $(this).next(".modal");
    var $modalContent = $modal.find(".modal-content");
    if ($modal.length) {
        // Move modal to body to prevent nesting issues
        if ($modal.parent().is('body') === false) {
            // Store original parent for restoration later
            $modal.data('original-parent', $modal.parent());
            $modal.appendTo('body');
            
            // Ensure proper z-index stacking
            var currentZIndex = parseInt($modal.css('z-index')) || 1000;
            $modal.css('z-index', currentZIndex + 1000);
        }
        
        $modal.css("display", "flex"); // Set display to block before animation
        gsap.to($modal, {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.out"
        });
        gsap.to($modalContent, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    }
});

$(".modal-close, .modal-bg").on("click", function () {
    var $modal = $(this).closest(".modal"); 
    var $modalContent = $modal.find(".modal-content");
    if ($modal.length) {
        gsap.to($modal, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: function () {
                $modal.css("display", "none"); // Hide after animation
                // Move modal back to its original position if it was moved to body
                var originalParent = $modal.data('original-parent');
                if (originalParent) {
                    $modal.appendTo(originalParent);
                    // Restore original z-index
                    $modal.css('z-index', '');
                }
            }
        });
        gsap.to($modalContent, {
            autoAlpha: 0,
            scale: 0.9,
            duration: 0.25,
            ease: "power2.out"
        });
    }
});