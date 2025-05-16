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

  if (hamburger && menu && closeBtn) {
    hamburger.addEventListener('click', () => {
      menu.classList.add('show');
      hamburger.classList.add('hide'); // ✅ 打开菜单时隐藏按钮
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
      menu.classList.remove('show');
      hamburger.classList.remove('hide'); // ✅ 关闭菜单时恢复按钮
      document.body.style.overflow = '';
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('show');
        hamburger.classList.remove('hide'); // ✅ 点菜单项也恢复按钮
        document.body.style.overflow = '';
      });
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