const PORTFOLIO_PAGE_METADATA = {
  '/': { pageName: 'home', pageType: 'landing', contentGroup: 'portfolio' },
  '/index.html': { pageName: 'home', pageType: 'landing', contentGroup: 'portfolio' },
  '/projects.html': { pageName: 'projects', pageType: 'listing', contentGroup: 'portfolio' },
  '/about.html': { pageName: 'about', pageType: 'about', contentGroup: 'portfolio' },
  '/contact.html': { pageName: 'contact', pageType: 'contact', contentGroup: 'portfolio' },
  '/privacy-policy.html': { pageName: 'privacy-policy', pageType: 'legal', contentGroup: 'portfolio' },
  '/under_development.html': { pageName: 'under-development', pageType: 'fallback', contentGroup: 'portfolio' },
  '/tubi.html': { pageName: 'project:tubi', pageType: 'project', contentGroup: 'projects' },
  '/remi.html': { pageName: 'project:remi', pageType: 'project', contentGroup: 'projects' },
  '/air_purifier.html': { pageName: 'project:air-purifier', pageType: 'project', contentGroup: 'projects' },
  '/sony_a7r5.html': { pageName: 'project:sony-a7r5', pageType: 'project', contentGroup: 'projects' },
  '/SONY_tc_150.html': { pageName: 'project:sony-tc-150', pageType: 'project', contentGroup: 'projects' },
  '/robotion.html': { pageName: 'project:robotion', pageType: 'project', contentGroup: 'projects' },
  '/rover.html': { pageName: 'project:rover-ai', pageType: 'project', contentGroup: 'projects' },
  '/music_kaleidoscope.html': { pageName: 'project:music-kaleidoscope', pageType: 'project', contentGroup: 'projects' },
  '/paintings.html': { pageName: 'project:paintings', pageType: 'gallery', contentGroup: 'projects' },
  '/Wuxi_Video_Project.html': { pageName: 'project:wuxi-video', pageType: 'project', contentGroup: 'projects' },
  '/porsche.html': { pageName: 'project:porsche', pageType: 'project', contentGroup: 'projects' },
  '/wordcloud.html': { pageName: 'project:wordcloud', pageType: 'project', contentGroup: 'projects' },
  '/making_sense_of_data/': { pageName: 'project:making-sense-of-data', pageType: 'data-story', contentGroup: 'projects' },
  '/making_sense_of_data/index.html': { pageName: 'project:making-sense-of-data', pageType: 'data-story', contentGroup: 'projects' },
  '/music_kaleidoscope/': { pageName: 'project:music-kaleidoscope-lab', pageType: 'interactive-experiment', contentGroup: 'projects' },
  '/music_kaleidoscope/index.html': { pageName: 'project:music-kaleidoscope-lab', pageType: 'interactive-experiment', contentGroup: 'projects' },
};

function normalizeAnalyticsPath(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const normalized = pathname.endsWith('/') ? pathname : pathname.replace(/\/+$/, '');
  return normalized || '/';
}

function slugifyValue(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';
}

function resolveAnalyticsContext() {
  const pathname = normalizeAnalyticsPath(window.location.pathname);
  const metadata =
    PORTFOLIO_PAGE_METADATA[pathname] ||
    PORTFOLIO_PAGE_METADATA[`${pathname}/`] ||
    PORTFOLIO_PAGE_METADATA[`${pathname}/index.html`];
  const fallbackName = document.body?.dataset.analyticsName || slugifyValue(document.title);

  return {
    path: pathname,
    pageName: metadata?.pageName || fallbackName,
    pageType: metadata?.pageType || 'page',
    contentGroup: metadata?.contentGroup || 'portfolio',
    title: document.title || 'Untitled Page',
  };
}

function getAnalyticsConfig() {
  const config = window.PORTFOLIO_ANALYTICS || {};

  return {
    enabled: Boolean(config.enabled),
    scriptUrl: typeof config.scriptUrl === 'string' ? config.scriptUrl.trim() : '',
    websiteId: typeof config.websiteId === 'string' ? config.websiteId.trim() : '',
    hostUrl: typeof config.hostUrl === 'string' ? config.hostUrl.trim() : '',
    domains: Array.isArray(config.domains) ? config.domains.filter(Boolean) : [],
    autoTrack: config.autoTrack !== false,
    doNotTrack: config.doNotTrack !== false,
    excludeLocalhost: config.excludeLocalhost !== false,
    heartbeatIntervals: Array.isArray(config.heartbeatIntervals)
      ? config.heartbeatIntervals.filter(Number.isFinite).sort((a, b) => a - b)
      : [30, 60, 120],
    activityTimeoutMs: Number.isFinite(config.activityTimeoutMs) ? config.activityTimeoutMs : 30000,
    minimumVisitSeconds: Number.isFinite(config.minimumVisitSeconds) ? config.minimumVisitSeconds : 10,
  };
}

function isDoNotTrackEnabled() {
  const doNotTrackValue = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  return doNotTrackValue === '1' || doNotTrackValue === 'yes';
}

function loadAnalyticsScript(config) {
  return new Promise(resolve => {
    if (!config.enabled || !config.scriptUrl || !config.websiteId) {
      resolve(false);
      return;
    }

    if (config.excludeLocalhost && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      resolve(false);
      return;
    }

    if (config.doNotTrack && isDoNotTrackEnabled()) {
      resolve(false);
      return;
    }

    const existingScript = document.querySelector('script[data-portfolio-analytics="true"]');
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = config.scriptUrl;
    script.dataset.portfolioAnalytics = 'true';
    script.dataset.websiteId = config.websiteId;

    if (config.domains.length) {
      script.dataset.domains = config.domains.join(',');
    }

    if (config.hostUrl) {
      script.dataset.hostUrl = config.hostUrl;
    }

    if (!config.autoTrack) {
      script.dataset.autoTrack = 'false';
    }

    if (config.doNotTrack) {
      script.dataset.doNotTrack = 'true';
    }

    script.addEventListener('load', () => resolve(true));
    script.addEventListener('error', () => resolve(false));
    document.head.appendChild(script);
  });
}

function setupPortfolioAnalytics() {
  const analyticsConfig = getAnalyticsConfig();
  const analyticsContext = resolveAnalyticsContext();
  const pendingEvents = [];
  let analyticsReady = false;

  const flushPendingEvents = () => {
    if (!analyticsReady || !window.umami || typeof window.umami.track !== 'function') {
      return;
    }

    while (pendingEvents.length) {
      const { eventName, payload } = pendingEvents.shift();
      window.umami.track(eventName, payload);
    }
  };

  const trackAnalyticsEvent = (eventName, payload = {}) => {
    if (!analyticsConfig.enabled) {
      return;
    }

    const eventPayload = {
      page_name: analyticsContext.pageName,
      page_type: analyticsContext.pageType,
      content_group: analyticsContext.contentGroup,
      page_path: analyticsContext.path,
      page_title: analyticsContext.title,
      ...payload,
    };

    if (analyticsReady && window.umami && typeof window.umami.track === 'function') {
      window.umami.track(eventName, eventPayload);
      return;
    }

    pendingEvents.push({ eventName, payload: eventPayload });
  };

  loadAnalyticsScript(analyticsConfig).then(loaded => {
    analyticsReady = loaded;
    flushPendingEvents();
  });

  const engagementState = {
    activeMs: 0,
    lastTickAt: Date.now(),
    lastSignalAt: Date.now(),
    intervalEventsSent: new Set(),
    summarySent: false,
  };

  const noteActivity = (() => {
    let lastRecordedAt = 0;

    return function markActivity(force = false) {
      const now = Date.now();
      if (!force && now - lastRecordedAt < 2000) {
        return;
      }

      lastRecordedAt = now;
      engagementState.lastSignalAt = now;
    };
  })();

  const updateEngagement = () => {
    const now = Date.now();
    const elapsed = now - engagementState.lastTickAt;
    engagementState.lastTickAt = now;

    const isVisible = document.visibilityState === 'visible';
    const isActiveWindow = now - engagementState.lastSignalAt <= analyticsConfig.activityTimeoutMs;

    if (!isVisible || !isActiveWindow) {
      return;
    }

    engagementState.activeMs += elapsed;

    analyticsConfig.heartbeatIntervals.forEach(seconds => {
      if (engagementState.activeMs >= seconds * 1000 && !engagementState.intervalEventsSent.has(seconds)) {
        engagementState.intervalEventsSent.add(seconds);
        trackAnalyticsEvent(`engaged_${seconds}s`, {
          active_seconds: seconds,
        });
      }
    });
  };

  const sendVisitSummary = () => {
    if (engagementState.summarySent) {
      return;
    }

    updateEngagement();

    const activeSeconds = Math.round(engagementState.activeMs / 1000);
    if (activeSeconds < analyticsConfig.minimumVisitSeconds) {
      engagementState.summarySent = true;
      return;
    }

    engagementState.summarySent = true;
    trackAnalyticsEvent('engaged_visit', {
      active_seconds: activeSeconds,
      max_engaged_bucket: Math.max(0, ...analyticsConfig.heartbeatIntervals.filter(
        seconds => engagementState.intervalEventsSent.has(seconds)
      )),
    });
  };

  noteActivity(true);
  const engagementTimer = window.setInterval(updateEngagement, 5000);

  ['click', 'scroll', 'touchstart', 'mousemove'].forEach(eventName => {
    document.addEventListener(eventName, () => noteActivity(), { passive: true });
  });
  document.addEventListener('keydown', () => noteActivity());

  document.addEventListener('visibilitychange', () => {
    updateEngagement();
    if (document.visibilityState === 'visible') {
      noteActivity(true);
    }
  });

  window.addEventListener('pagehide', event => {
    updateEngagement();
    if (event.persisted) {
      return;
    }

    sendVisitSummary();
    window.clearInterval(engagementTimer);
  });

  window.addEventListener('beforeunload', sendVisitSummary);
}

setupPortfolioAnalytics();

document.addEventListener('DOMContentLoaded', () => {
  // ===== Fade-up Animation When In View =====
  const fadeUps = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  fadeUps.forEach(el => observer.observe(el));

  // ===== Dark Mode Toggle with Local Storage =====
  const toggleDark = document.getElementById('toggle-dark');
  if (toggleDark) {
    if (localStorage.getItem('theme') === 'dark') {
      toggleDark.textContent = '☀️';
    } else {
      toggleDark.textContent = '🌙';
    }

    toggleDark.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
      toggleDark.textContent = mode === 'dark' ? '☀️' : '🌙';
    });
  }

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // ===== Language Toggle Button =====
  const toggleLang = document.getElementById('toggle-lang');

  if (toggleLang) {
    toggleLang.addEventListener('click', () => {
      const popup = document.createElement('div');
      popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: var(--text-primary, #ffffff);
        padding: 24px 32px;
        border-radius: 16px;
        z-index: 1000;
        font-family: 'Plus Jakarta Sans', sans-serif;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      popup.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        ">
          <div style="
            font-size: 2.5rem;
            margin-bottom: 8px;
            animation: float 2s ease-in-out infinite;
          ">🚧</div>
          <h3 style="
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
            background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          ">Work in Progress</h3>
          <p style="
            margin: 0;
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
          ">Translation feature coming soon!</p>
        </div>
      `;
      document.body.appendChild(popup);

      const style = document.createElement('style');
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `;
      document.head.appendChild(style);

      requestAnimationFrame(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
      });

      setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
        setTimeout(() => {
          popup.remove();
          style.remove();
        }, 300);
      }, 2500);
    });
  }

  // ===== Zoom-out effect on scroll for cover =====
  const coverBg = document.getElementById('cover-bg');
  if (coverBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = 600;
      const minScale = 0.8;
      const scale = Math.max(minScale, 1 - (scrollY / maxScroll) * (1 - minScale));
      coverBg.style.transform = `scale(${scale})`;
    });
  }

  // ===== Mobile Hamburger Menu =====
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  const closeBtn = document.getElementById('close-menu');
  const menuLinks = document.querySelectorAll('#menu a');

  if (hamburger && menu && closeBtn) {
    const openMenu = () => {
      menu.classList.add('show');
      hamburger.classList.add('hide');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      menu.classList.remove('show');
      hamburger.classList.remove('hide');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', e => {
      if (menu.classList.contains('show') &&
          !menu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Consent notice for local preferences + privacy-friendly analytics.
  const cookieConsent = document.getElementById('cookie-consent');
  const acceptCookies = document.getElementById('accept-cookies');
  if (cookieConsent && acceptCookies) {
    if (!localStorage.getItem('cookiesAccepted')) {
      cookieConsent.style.display = 'flex';
    }
    acceptCookies.addEventListener('click', function () {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieConsent.style.display = 'none';
    });
  }
});

// ===== Filter Functionality =====
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-block');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    projects.forEach(project => {
      const categories = (project.getAttribute('data-category') || '').split(/\s+/).filter(Boolean);
      if (filter === 'all' || categories.includes(filter)) {
        project.style.display = 'flex';
      } else {
        project.style.display = 'none';
      }
    });
  });
});

// language translation system building