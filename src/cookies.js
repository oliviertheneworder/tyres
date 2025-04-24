/**
 * Cookie Consent Manager
 * Handles user consent preferences for analytics and marketing cookies
 */

// DOM Elements
const elements = {
    cookieBanner: document.getElementById("cookie-banner"),
    customiseBtn: document.getElementById("customise-cookies"),
    saveBtn: document.getElementById("save-cookies"),
    acceptAllBtn: document.getElementById("accept-all-cookies"),
    acceptAllBtn2: document.getElementById("accept-all-cookies-2"),
    formWrap: document.querySelector(".cookie-form-wrap"),
    saveWrap: document.querySelector(".cookie-save-wrap"),
    buttonWrap: document.querySelector(".cookie-button-wrap"),
    analyticsCheckbox: document.getElementById("AnalyticsCookie"),
    marketingCheckbox: document.getElementById("MarketingCookie")
  };
  
  // Cookie Utility Functions
  const cookieUtils = {
    set(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
    },
    
    get(name) {
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return decodeURIComponent(value);
      }
      return null;
    }
  };
  
  // Consent Management
  const consentManager = {
    apply(consent) {
      // Apply Google Consent Mode settings if gtag exists
      if (typeof gtag === "function") {
        gtag('consent', 'update', {
          'ad_storage': consent.marketing ? 'granted' : 'denied',
          'analytics_storage': consent.analytics ? 'granted' : 'denied',
          'ad_user_data': consent.marketing ? 'granted' : 'denied',
          'ad_personalization': consent.marketing ? 'granted' : 'denied'
        });
      }
  
      // Handle Meta/Facebook pixel consent if fbq exists
      if (typeof fbq === "function" && !consent.marketing) {
        fbq('consent', 'revoke');
      }
    },
    
    save() {
      const consent = {
        analytics: elements.analyticsCheckbox.checked,
        marketing: elements.marketingCheckbox.checked
      };
  
      cookieUtils.set("user_consent", JSON.stringify(consent), 365);
      consentManager.apply(consent);
      bannerManager.hide();
    },
    
    acceptAll() {
      const consent = { analytics: true, marketing: true };
      cookieUtils.set("user_consent", JSON.stringify(consent), 365);
      consentManager.apply(consent);
      bannerManager.hide();
    },
    
    check() {
      const savedConsent = cookieUtils.get("user_consent");
      try {
        if (savedConsent) {
          const parsedConsent = JSON.parse(savedConsent);
          consentManager.apply(parsedConsent);
          elements.cookieBanner.style.display = "none";
        } else {
          elements.cookieBanner.style.display = "flex";
        }
      } catch (e) {
        elements.cookieBanner.style.display = "flex";
      }
    }
  };
  
  // Banner UI Management
  const bannerManager = {
    hide() {
      elements.cookieBanner.style.opacity = "0";
      setTimeout(() => elements.cookieBanner.style.display = "none", 300);
    },
    
    showCustomisation() {
      elements.formWrap.style.display = "block";
      elements.saveWrap.style.display = "grid";
      elements.buttonWrap.style.display = "none";
    }
  };
  
  // Event Listeners
  function initEventListeners() {
    elements.customiseBtn.addEventListener("click", bannerManager.showCustomisation);
    elements.saveBtn.addEventListener("click", consentManager.save);
    elements.acceptAllBtn.addEventListener("click", consentManager.acceptAll);
    elements.acceptAllBtn2.addEventListener("click", consentManager.acceptAll);
  }
  
  // Initialize
  function init() {
    // console.log("Loaded cookie consent manager");
    initEventListeners();
    consentManager.check();
  }
  
  // Run on page load
  init();