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
    // Additional selectors for video player ads
    'div[class*="player-ads"]',
    'div[class*="video-ad"]',
    '.overlay-ad',
    '#player-advertising',
    '[class*="preroll"]',
    '[class*="midroll"]',
    '[id*="adContainer"]'
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

  // Block all redirects except for trusted domains
  const isBlockedDomain = (url: string): boolean => {
    try {
      const urlObj = new URL(url, window.location.origin);
      const blockedDomains = [
        'nexusbloom.xyz',
        'clickid',
        'ad.doubleclick.net',
        'googleadservices.com',
        'adservice.google.com'
      ];
      return blockedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return true; // Block invalid URLs
    }
  };

  // Override pushState
  history.pushState = function(...args) {
    const newUrl = args[2]?.toString();
    if (newUrl && !isBlockedDomain(newUrl)) {
      originalPushState.apply(this, args);
    } else {
      console.warn('Blocked redirect attempt:', newUrl);
    }
  };

  // Override replaceState
  history.replaceState = function(...args) {
    const newUrl = args[2]?.toString();
    if (newUrl && !isBlockedDomain(newUrl)) {
      originalReplaceState.apply(this, args);
    } else {
      console.warn('Blocked replace attempt:', newUrl);
    }
  };

  // Override location.assign
  window.location.assign = function(url: string) {
    if (!isBlockedDomain(url)) {
      originalAssign.call(window.location, url);
    } else {
      console.warn('Blocked assign attempt:', url);
    }
  };

  // Override location.replace
  window.location.replace = function(url: string) {
    if (!isBlockedDomain(url)) {
      originalReplace.call(window.location, url);
    } else {
      console.warn('Blocked replace attempt:', url);
    }
  };

  // Block href clicks
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    if (link && isBlockedDomain(link.href)) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('Blocked link click:', link.href);
    }
  }, true);

  // Block form submissions to untrusted domains
  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement;
    if (form && isBlockedDomain(form.action)) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('Blocked form submission:', form.action);
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
    console.warn('Blocked popup:', url);
    return null;
  };

  // Block window.open calls
  Object.defineProperty(window, 'open', {
    value: function() {
      return null;
    }
  });
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