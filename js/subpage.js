/* =============================================
   SUBPAGE SHARED JS — MATÉO RAMET
   ============================================= */
'use strict';

// ===== Header Mobile Menu =====
(function() {
  const btn = document.querySelector('.sp-menu-btn');
  const nav = document.querySelector('.sp-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('bx-x', open);
    btn.classList.toggle('bx-menu', !open);
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('bx-x');
      btn.classList.add('bx-menu');
    });
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('open');
      btn.classList.remove('bx-x');
      btn.classList.add('bx-menu');
    }
  });
})();

// ===== Scroll Reveal =====
(function() {
  const els = document.querySelectorAll('.sp-animate');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = Number(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = i * 80;
    obs.observe(el);
  });
})();

// ===== Accordion =====
(function() {
  document.querySelectorAll('.sp-accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const allBtns = document.querySelectorAll('.sp-accordion-btn');
      const allContents = document.querySelectorAll('.sp-accordion-content');
      // Close others
      allBtns.forEach(b => { if (b !== btn) { b.classList.remove('open'); } });
      allContents.forEach(c => { if (c !== content) { c.classList.remove('open'); c.style.display = 'none'; }});
      // Toggle current
      const isOpen = btn.classList.toggle('open');
      content.classList.toggle('open', isOpen);
      content.style.display = isOpen ? 'block' : 'none';
    });
  });
})();

// ===== Current Year =====
const yrEl = document.getElementById('current-year');
if (yrEl) yrEl.textContent = new Date().getFullYear();

// ===== Project Detail Carousel =====
(function() {
  const carousel = document.querySelector('.pd-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.pd-carousel-track');
  const slides = carousel.querySelectorAll('.pd-carousel-slide');
  const dotsContainer = carousel.nextElementSibling;
  const prevBtn = carousel.querySelector('.pd-carousel-btn.prev');
  const nextBtn = carousel.querySelector('.pd-carousel-btn.next');
  if (!slides.length) return;

  let current = 0;
  let autoTimer;

  // Build dots
  const dots = [];
  if (dotsContainer && dotsContainer.classList.contains('pd-carousel-dots')) {
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'pd-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
      dots.push(d);
    });
  }

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  });

  startAuto();
})();
