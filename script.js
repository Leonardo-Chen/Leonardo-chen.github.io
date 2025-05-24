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
    // Set initial icon based on stored theme
    if (localStorage.getItem('theme') === 'dark') {
      toggleDark.textContent = '☀️';
    } else {
      toggleDark.textContent = '🌙';
    }

    toggleDark.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
      // Update icon
      toggleDark.textContent = mode === 'dark' ? '☀️' : '🌙';
    });
  }

  // Load stored theme preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // ===== Language Toggle Button =====
  const toggleLang = document.getElementById('toggle-lang');
  let isChinese = false;
  
  if (toggleLang) {
    toggleLang.addEventListener('click', () => {
      // Show work in progress popup
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

      // Add floating animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `;
      document.head.appendChild(style);

      // Trigger entrance animation
      requestAnimationFrame(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
      });

      // Remove popup after 2.5 seconds with exit animation
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

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('show') && 
          !menu.contains(e.target) && 
          !hamburger.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Cookie Consent
  const cookieConsent = document.getElementById('cookie-consent');
  const acceptCookies = document.getElementById('accept-cookies');
  
  // Check if user has already accepted cookies
  if (!localStorage.getItem('cookiesAccepted')) {
    cookieConsent.style.display = 'flex';
  }
  
  // Handle cookie acceptance
  acceptCookies.addEventListener('click', function() {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieConsent.style.display = 'none';
  });
});

// ===== Filter Functionality =====
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-block');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Highlight selected button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Get selected category
    const filter = button.getAttribute('data-filter');

    // Show/hide projects based on category
    projects.forEach(project => {
      const categories = project.getAttribute('data-category').split(' ');
      if (filter === 'all' || categories.includes(filter)) {
        project.style.display = 'flex';
      } else {
        project.style.display = 'none';
      }
    });
  });
});

//language traslation system building