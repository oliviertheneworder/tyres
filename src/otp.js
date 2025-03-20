console.log("otp.js");

let otpHidden = $("#otp-hidden");
let otpBoxes = $(".otp-box");

otpBoxes.on("paste", function(e) {
    e.preventDefault();
    // Get pasted data
    let pastedData = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
    // Only keep numbers
    pastedData = pastedData.replace(/[^0-9]/g, '');
    
    // Distribute the pasted numbers across boxes
    for (let i = 0; i < pastedData.length && i < otpBoxes.length; i++) {
        otpBoxes.eq(i).text(pastedData[i]);
    }
    
    // Update hidden input
    let otpValue = "";
    otpBoxes.each(function() {
        otpValue += $(this).text();
    });
    otpHidden.val(otpValue);
    
    // Focus the next empty box or the last box
    let filledBoxes = pastedData.length;
    if (filledBoxes < otpBoxes.length) {
        otpBoxes.eq(filledBoxes).focus();
    } else {
        otpBoxes.eq(otpBoxes.length - 1).focus();
    }
});

otpBoxes.on("input", function () {
    let value = $(this).text().trim();
    if (value.length > 1) {
        $(this).text(value.charAt(0));
    }
    // Update hidden input
    let otpValue = "";
    otpBoxes.each(function () {
        otpValue += $(this).text();
    });
    otpHidden.val(otpValue);
    // Move to next box
    if (value.length === 1) {
        $(this).next().focus();
    }
});

otpBoxes.on("keydown", function (e) {
    if (e.key === "Backspace" && $(this).text() === "") {
        $(this).prev().focus();
    }
});

otpBoxes.on("click", function () {
    let index = otpBoxes.index(this);
    otpBoxes.eq(index).focus();
});