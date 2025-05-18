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
    toggleDark.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
    });
  }

  // Load stored theme preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // ===== Language Toggle Button =====
  const toggleLang = document.getElementById('toggle-lang');
  if (toggleLang) {
    toggleLang.addEventListener('click', () => {
      const current = toggleLang.innerText.trim();
      toggleLang.innerText = current === '中 / EN' ? 'EN / 中' : '中 / EN';
      alert('Language switching is not yet implemented.');
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

  // 添加菜单状态管理
  let isMenuOpen = false;

  function openMenu() {
    if (!isMenuOpen) {
      menu.classList.add('show');
      hamburger.classList.add('hide');
      document.body.style.overflow = 'hidden';
      isMenuOpen = true;
    }
  }

  function closeMenu() {
    if (isMenuOpen) {
      menu.classList.remove('show');
      hamburger.classList.remove('hide');
      document.body.style.overflow = '';
      isMenuOpen = false;
    }
  }

  // 添加点击事件监听器
  if (hamburger && menu && closeBtn) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      openMenu();
    });

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
    });

    // 点击菜单项关闭菜单
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // 点击菜单外部区域关闭菜单
    document.addEventListener('click', (e) => {
      if (isMenuOpen && !menu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    });

    // 添加 ESC 键关闭菜单
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    });
  }

});

// ===== Language Toggle =====
const langToggle = document.getElementById('toggle-lang');
let isChinese = false;

langToggle.addEventListener('click', () => {
  isChinese = !isChinese;
  document.querySelectorAll('.en').forEach(el => el.classList.toggle('hidden', isChinese));
  document.querySelectorAll('.cn').forEach(el => el.classList.toggle('hidden', !isChinese));
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