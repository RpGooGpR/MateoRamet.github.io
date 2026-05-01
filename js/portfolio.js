/* =============================================
   PORTFOLIO — MATÉO RAMET | GAME DESIGNER
   Main JavaScript
   ============================================= */

'use strict';

/* =============================================
   PARTICLES CANVAS
   ============================================= */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  class Particle {
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.8 + 0.4;
      this.opacity = Math.random() * 0.45 + 0.08;
      this.color = Math.random() > 0.55 ? '124, 58, 237' : '6, 182, 212';
    }
    constructor() { this.reset(); }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 9500), 130);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
})();


/* =============================================
   TYPED TEXT EFFECT
   ============================================= */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Junior Level Designer',
    'Game Designer',
    'Track Designer',
    'UE5 Enthusiast',
    'Gamagora — Lyon'
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let speed     = 90;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 75 + Math.random() * 40;
      if (charIdx === current.length) {
        deleting = true;
        speed = 2200; // pause before delete
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 38;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed     = 380;
      }
    }
    setTimeout(type, speed);
  }
  setTimeout(type, 1100);
})();


/* =============================================
   HEADER — Scroll behavior
   ============================================= */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* =============================================
   MOBILE MENU
   ============================================= */
(function initMobileMenu() {
  const menuIcon = document.getElementById('menu-icon');
  const navbar   = document.getElementById('navbar');
  if (!menuIcon || !navbar) return;

  menuIcon.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('open');
    menuIcon.classList.toggle('bx-x', isOpen);
    menuIcon.classList.toggle('bx-menu', !isOpen);
  });

  // Close when a link is clicked
  navbar.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('open');
      menuIcon.classList.remove('bx-x');
      menuIcon.classList.add('bx-menu');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
      navbar.classList.remove('open');
      menuIcon.classList.remove('bx-x');
      menuIcon.classList.add('bx-menu');
    }
  });
})();


/* =============================================
   ACTIVE NAV LINK — Scroll Spy
   ============================================= */
(function initScrollSpy() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  function update() {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(s => {
      if (scrollY >= s.offsetTop) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* =============================================
   SCROLL-REVEAL ANIMATIONS
   ============================================= */
(function initScrollReveal() {
  const els = document.querySelectorAll('.animate-on-scroll');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings that appear together
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();





/* =============================================
   SMOOTH ANCHOR SCROLLING (polyfill fallback)
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* =============================================
   STAGGER GRID CHILDREN
   — Auto-add data-delay to grid items
   ============================================= */
(function staggerGrids() {
  const grids = document.querySelectorAll(
    '.interests-grid, .projets-grid, .parcours-row'
  );
  grids.forEach(grid => {
    const items = grid.querySelectorAll('.animate-on-scroll');
    items.forEach((item, i) => {
      item.dataset.delay = i * 80;
    });
  });
})();
