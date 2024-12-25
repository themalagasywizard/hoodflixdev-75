// Enhanced content blocker utility functions with mobile support
const blockAds = () => {
  // Enhanced mobile-specific ad selectors
  const adSelectors = [
    // Standard ad selectors
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
    // Mobile-specific ad selectors
    'div[class*="app-install"]',
    'div[class*="app-banner"]',
    'div[class*="smart-banner"]',
    'div[class*="mobile-banner"]',
    'div[class*="mobile-ad"]',
    // Video player specific selectors
    'div[class*="player-ads"]',
    'div[class*="video-ad"]',
    '.overlay-ad',
    '#player-advertising',
    '[class*="preroll"]',
    '[class*="midroll"]',
    '[id*="adContainer"]',
    // Safari-specific selectors
    'div[class*="safari-banner"]',
    'div[class*="ios-prompt"]',
    // Additional overlay and popup selectors
    '[class*="overlay"]',
    '[class*="popup"]',
    '[id*="overlay"]',
    '[id*="popup"]',
    // Mobile-specific popup selectors
    '[class*="mobile-overlay"]',
    '[class*="mobile-popup"]',
    '[class*="app-download"]'
  ];

  // Block inline scripts that create ads
  const blockInlineScripts = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node: Node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            if (element.tagName === 'SCRIPT') {
              const src = element.getAttribute('src') || '';
              if (src.includes('ads') || src.includes('analytics') || src.includes('tracking')) {
                element.remove();
              }
            }
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  };

  // Enhanced mobile popup blocker
  const blockPopups = () => {
    // Override window.open
    const originalOpen = window.open;
    window.open = function(...args) {
      console.log('Blocked popup attempt:', args[0]);
      return null;
    };

    // Block Safari-specific popups
    if (navigator.userAgent.includes('Safari')) {
      window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        return;
      });
    }
  };

  // Block mobile-specific redirects
  const blockMobileRedirects = () => {
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    const trustedDomains = [
      'api.themoviedb.org',
      'vidsrc.me',
      'image.tmdb.org'
    ];

    window.location.assign = function(url: string) {
      if (trustedDomains.some(domain => url.includes(domain))) {
        originalAssign.call(window.location, url);
      } else {
        console.log('Blocked redirect attempt:', url);
      }
    };

    window.location.replace = function(url: string) {
      if (trustedDomains.some(domain => url.includes(domain))) {
        originalReplace.call(window.location, url);
      } else {
        console.log('Blocked replace attempt:', url);
      }
    };
  };

  // Remove ads periodically
  const removeAds = () => {
    adSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.remove();
      });
    });
  };

  // Block mobile-specific overlay ads
  const blockOverlayAds = () => {
    const style = document.createElement('style');
    style.textContent = `
      body .overlay-ad,
      body .mobile-overlay,
      body .popup-overlay,
      body .app-banner,
      body .smart-banner {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      body {
        overflow: auto !important;
        position: static !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Initialize all blockers
  const initializeBlockers = () => {
    blockInlineScripts();
    blockPopups();
    blockMobileRedirects();
    blockOverlayAds();
    
    // Run removeAds initially and set up interval
    removeAds();
    setInterval(removeAds, 1000);

    // Additional Safari-specific handling
    if (navigator.userAgent.includes('Safari')) {
      document.addEventListener('touchstart', (e) => {
        if ((e.target as HTMLElement).closest('[class*="popup"], [class*="overlay"]')) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  };

  // Start blocking on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlockers);
  } else {
    initializeBlockers();
  }
};

// Initialize content blockers
export const initializeBlockers = () => {
  blockAds();
  console.log('Enhanced mobile content blockers initialized');
};