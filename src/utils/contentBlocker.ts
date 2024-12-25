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
    '[class*="app-download"]',
    // Additional aggressive selectors for mobile
    '[class*="modal"]',
    '[class*="lightbox"]',
    '[class*="interstitial"]',
    '[class*="notification"]',
    '[class*="banner"]',
    '[class*="float"]',
    '[class*="sticky"]'
  ];

  // Block inline scripts that create ads and popups
  const blockInlineScripts = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node: Node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            if (element.tagName === 'SCRIPT') {
              const src = element.getAttribute('src') || '';
              const content = element.textContent || '';
              if (
                src.includes('ads') || 
                src.includes('analytics') || 
                src.includes('tracking') ||
                content.includes('popup') ||
                content.includes('modal') ||
                content.includes('overlay')
              ) {
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

    // Block common popup methods
    window.alert = () => {};
    window.confirm = () => false;
    window.prompt = () => null;
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

  // Remove ads and popups periodically
  const removeAds = () => {
    adSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.remove();
      });
    });

    // Additional cleanup for mobile
    document.querySelectorAll('*').forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      if (
        computedStyle.position === 'fixed' ||
        computedStyle.position === 'sticky'
      ) {
        const elementText = element.textContent?.toLowerCase() || '';
        if (
          elementText.includes('ad') ||
          elementText.includes('download') ||
          elementText.includes('install') ||
          elementText.includes('subscribe')
        ) {
          (element as HTMLElement).remove();
        }
      }
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
      body .smart-banner,
      body div[class*="modal"],
      body div[class*="popup"],
      body div[class*="overlay"],
      body div[class*="banner"],
      body div[class*="notification"],
      body div[class*="interstitial"] {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
        z-index: -9999 !important;
      }
      body {
        overflow: auto !important;
        position: static !important;
        touch-action: auto !important;
      }
      html {
        overflow: auto !important;
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
    setInterval(removeAds, 500); // Increased frequency for more aggressive blocking

    // Additional Safari-specific handling
    if (navigator.userAgent.includes('Safari')) {
      document.addEventListener('touchstart', (e) => {
        if ((e.target as HTMLElement).closest('[class*="popup"], [class*="overlay"], [class*="modal"], [class*="banner"]')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, { passive: false, capture: true });
    }

    // Prevent scroll locking
    Object.defineProperty(document.body.style, 'overflow', {
      configurable: true,
      get: () => 'auto',
      set: () => 'auto'
    });
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