console.log('gsap.js');

gsap.registerPlugin(ScrollTrigger);

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