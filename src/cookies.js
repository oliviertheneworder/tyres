console.log("Loaded cookies.js");

const cookieBanner = document.getElementById("cookie-banner");
const customiseBtn = document.getElementById("customise-cookies");
const saveBtn = document.getElementById("save-cookies");
const acceptAllBtn = dconsole.log("Loadedtyres.js");ocument.getElementById("accept-all-cookies");
const acceptAllBtn2 = document.getElementById("accept-all-cookies-2");
const formWrap = document.querySelector(".cookie-form-wrap");
const saveWrap = document.querySelector(".cookie-save-wrap");
const buttonWrap = document.querySelector(".cookie-button-wrap");

const analyticsCheckbox = document.getElementById("AnalyticsCookie");
const marketingCheckbox = document.getElementById("MarketingCookie");

// Essential Cookie Functions (Preserve Site Functionality)
function setCookie(name, value, days) {
    let expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
}

function getCookie(name) {
    let cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        let [key, value] = cookies[i].split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

// Hide Banner If Consent Already Exists
function checkConsent() {
    let savedConsent = getCookie("user_consent");
    try {
        if (savedConsent) {
            let parsedConsent = JSON.parse(savedConsent);
            // console.log("Parsed consent:", parsedConsent); // Log parsed consent
            applyConsentPreferences(parsedConsent);
            cookieBanner.style.display = "none"; // Ensure it doesn’t flash again
        } else {
            cookieBanner.style.display = "flex";
        }
    } catch (e) {
        // console.error("Error parsing cookie consent data", e);
        cookieBanner.style.display = "flex";
    }
}

// Apply Consent Preferences (Google Consent Mode & Meta Ads)
function applyConsentPreferences(consent) {
    // console.log("Applying consent preferences:", consent); // Log applying consent
    if (typeof gtag === "function") {
        gtag('consent', 'update', {
            'ad_storage': consent.marketing ? 'granted' : 'denied',
            'analytics_storage': consent.analytics ? 'granted' : 'denied',
            'ad_user_data': consent.marketing ? 'granted' : 'denied',
            'ad_personalization': consent.marketing ? 'granted' : 'denied'
        });
    }

    if (typeof fbq === "function" && !consent.marketing) {
        fbq('consent', 'revoke');
    }
}

// Save User Preferences & Apply Consent
function savePreferences() {
    const consent = {
        analytics: analyticsCheckbox.checked,
        marketing: marketingCheckbox.checked
    };

    setCookie("user_consent", JSON.stringify(consent), 365);
    applyConsentPreferences(consent);
    hideBanner();
}

function acceptAllCookies() {
    const consent = { analytics: true, marketing: true };
    setCookie("user_consent", JSON.stringify(consent), 365);
    applyConsentPreferences(consent);
    hideBanner();
}

function hideBanner() {
    cookieBanner.style.opacity = "0";
    setTimeout(() => cookieBanner.style.display = "none", 300);
}

function showCustomisation() {
    formWrap.style.display = "block";
    saveWrap.style.display = "grid";
    buttonWrap.style.display = "none";
}

// Attach Event Listeners (For Webflow Compatibility)
customiseBtn.addEventListener("click", showCustomisation);
saveBtn.addEventListener("click", savePreferences);
acceptAllBtn.addEventListener("click", acceptAllCookies);
acceptAllBtn2.addEventListener("click", acceptAllCookies);

// Run Consent Check on Page Load
checkConsent();