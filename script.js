// ===== Sticky Navbar on Scroll =====
const navbar = document.getElementById('navbar');
const coverSection = document.getElementById('cover-section');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const coverHeight = coverSection.offsetHeight;

  if (scrollY >= coverHeight) {
    navbar.classList.add('fixed');
  } else {
    navbar.classList.remove('fixed');
  }
});

// ===== Fade-up Animation When In View =====
const fadeUps = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Optional: Only animate once
    }
  });
}, {
  threshold: 0.2
});

fadeUps.forEach(el => observer.observe(el));

// ===== Dark Mode Toggle with Local Storage =====
const toggleDark = document.getElementById('toggle-dark');

toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', mode);
});

// Load stored theme preference
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
});

// ===== Language Toggle Button =====
const toggleLang = document.getElementById('toggle-lang');

toggleLang.addEventListener('click', () => {
  const current = toggleLang.innerText.trim();
  toggleLang.innerText = current === '中 / EN' ? 'EN / 中' : '中 / EN';

  // TODO: Replace with real i18n logic if needed
  alert('Language switching is not yet implemented.');
});

// ===== Zoom-out effect on scroll =====
const coverBg = document.getElementById('cover-bg');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = 600; // 滑动多少 px 时达到最小缩放
  const minScale = 0.8; // 最小缩放值

  // 计算缩放值，范围在 [minScale, 1] 之间
  const scale = Math.max(minScale, 1 - (scrollY / maxScroll) * (1 - minScale));

  coverBg.style.transform = `scale(${scale})`;
});
