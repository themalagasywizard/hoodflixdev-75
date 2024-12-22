// Content blocker utility functions
const blockAds = () => {
  // Block common ad elements
  const adSelectors = [
    'iframe[src*="doubleclick.net"]',
    'iframe[src*="google-analytics.com"]',
    'iframe[src*="googleadservices.com"]',
    'div[class*="ad-"]',
    'div[class*="ads-"]',
    'div[id*="ad-"]',
    'div[id*="ads-"]',
    'ins.adsbygoogle',
    '[class*="sponsored"]',
    '[id*="sponsored"]',
  ];

  const removeAds = () => {
    adSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.remove();
      });
    });
  };

  // Run initially and observe DOM changes
  removeAds();
  const observer = new MutationObserver(removeAds);
  observer.observe(document.body, { childList: true, subtree: true });
};

// Block unwanted redirects
const blockRedirects = () => {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  // Override pushState
  history.pushState = function(...args) {
    const newUrl = args[2]?.toString();
    if (newUrl && isValidRedirect(newUrl)) {
      originalPushState.apply(this, args);
    }
  };

  // Override replaceState
  history.replaceState = function(...args) {
    const newUrl = args[2]?.toString();
    if (newUrl && isValidRedirect(newUrl)) {
      originalReplaceState.apply(this, args);
    }
  };
};

// Block pop-ups
const blockPopups = () => {
  // Override window.open
  const originalOpen = window.open;
  window.open = function(...args) {
    const url = args[0]?.toString();
    if (url && isValidPopup(url)) {
      return originalOpen.apply(this, args);
    }
    return null;
  };

  // Block common pop-up events
  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    return;
  });
};

// Helper function to check if redirect is valid
const isValidRedirect = (url: string): boolean => {
  try {
    const urlObj = new URL(url, window.location.origin);
    // Allow only same-origin redirects or specific trusted domains
    return urlObj.origin === window.location.origin || 
           /^https:\/\/(api\.themoviedb\.org|vidsrc\.me)/.test(urlObj.origin);
  } catch {
    return false;
  }
};

// Helper function to check if popup is valid
const isValidPopup = (url: string): boolean => {
  try {
    const urlObj = new URL(url, window.location.origin);
    // Allow only specific trusted domains for popups
    return /^https:\/\/(api\.themoviedb\.org|vidsrc\.me)/.test(urlObj.origin);
  } catch {
    return false;
  }
};

// Initialize all blockers
export const initializeBlockers = () => {
  blockAds();
  blockRedirects();
  blockPopups();
  console.log('Content blockers initialized');
};