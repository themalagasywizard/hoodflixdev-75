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
    'iframe[src*="nexusbloom.xyz"]',
    'a[href*="nexusbloom.xyz"]',
    'iframe[src*="clickid"]',
    'a[href*="clickid"]',
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

// Enhanced redirect blocking
const blockRedirects = () => {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  const originalAssign = window.location.assign;
  const originalReplace = window.location.replace;

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

  // Override location.assign
  window.location.assign = function(url: string) {
    if (isValidRedirect(url)) {
      originalAssign.call(window.location, url);
    }
  };

  // Override location.replace
  window.location.replace = function(url: string) {
    if (isValidRedirect(url)) {
      originalReplace.call(window.location, url);
    }
  };

  // Block href clicks
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    if (link && !isValidRedirect(link.href)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
};

// Enhanced popup blocking
const blockPopups = () => {
  const originalOpen = window.open;
  window.open = function(...args) {
    const url = args[0]?.toString();
    if (url && isValidPopup(url)) {
      return originalOpen.apply(this, args);
    }
    return null;
  };

  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    return;
  });

  // Block window.open calls
  Object.defineProperty(window, 'open', {
    value: function() {
      return null;
    }
  });
};

// Enhanced redirect validation
const isValidRedirect = (url: string): boolean => {
  try {
    const urlObj = new URL(url, window.location.origin);
    const trustedDomains = [
      window.location.origin,
      'api.themoviedb.org',
      'vidsrc.me',
      'image.tmdb.org',
      'i.ibb.co'
    ];
    
    return trustedDomains.some(domain => 
      urlObj.origin === window.location.origin || 
      urlObj.hostname.includes(domain)
    );
  } catch {
    return false;
  }
};

// Enhanced popup validation
const isValidPopup = (url: string): boolean => {
  try {
    const urlObj = new URL(url, window.location.origin);
    const trustedDomains = [
      'api.themoviedb.org',
      'vidsrc.me',
      'image.tmdb.org'
    ];
    
    return trustedDomains.some(domain => 
      urlObj.hostname.includes(domain)
    );
  } catch {
    return false;
  }
};

// Initialize all blockers
export const initializeBlockers = () => {
  blockAds();
  blockRedirects();
  blockPopups();
  console.log('Enhanced content blockers initialized');
};